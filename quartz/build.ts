import sourceMapSupport from "source-map-support"
sourceMapSupport.install()
import path from "path"
import { deleteAsync } from "del"
import { GlobbyFilterFunction, isGitIgnored } from "globby"
import chalk from "chalk"
import { FilePath, FullSlug, joinSegments, slugifyFilePath } from "./util/path"
import { BuildCtx, Argv } from "./util/ctx"
import { Mutex } from "async-mutex"
import { trace } from "./util/trace"
import { QuartzConfig } from "./cfg"
import { ProcessedContent } from "./plugins/vfile"
import { glob } from "./util/glob"
import { parseMarkdown } from "./processors/parse"
import { filterContent } from "./processors/filter"
import { emitContent } from "./processors/emit"
import { getStaticResourcesFromPlugins } from "./plugins"
import DepGraph from "./depgraph"
import { randomUUID } from "crypto"
import { PerfTimer } from "./util/perf"
import chokidar from "chokidar"
import { toPosixPath } from "./util/glob"
import { FileEvent } from "./util/cmd"

// Type for mapping emitter names to their dependency graphs
type Dependencies = Record<string, DepGraph<FilePath> | null>

export const QUARTZ_VERSION = "4.4.0"
export const QUARTZ_SOURCE_PATH = path.join(import.meta.dirname!, "..")

function newBuildId(): string {
  return randomUUID()
}

async function buildQuartz(argv: Argv, mut: Mutex, clientRefresh: () => void): Promise<void> {
  const perf = new PerfTimer()
  const output = argv.output

  // release old build
  perf.addEvent("clean")
  await deleteAsync([path.join(output, "*")], { force: true })
  console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`)

  // Import user's configuration
  const userConfig = (await import(path.join(QUARTZ_SOURCE_PATH, "quartz.config.js"))).default as QuartzConfig

  const ctx: BuildCtx = {
    buildId: newBuildId(),
    argv,
    cfg: userConfig,
    allSlugs: [],
  }

  const pluginCount = Object.values(ctx.cfg.plugins).flat().length
  const pluginNames = (key: "transformers" | "filters" | "emitters") =>
    ctx.cfg.plugins[key].map((plugin) => plugin.name)
  if (argv.verbose) {
    console.log(`Loaded ${pluginCount} plugins`)
    console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`)
    console.log(`  Filters: ${pluginNames("filters").join(", ")}`)
    console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`)
  }

  const release = await mut.acquire()
  perf.addEvent("glob")
  const allFiles = await glob("**/*.*", argv.directory, ctx.cfg.configuration.ignorePatterns)
  const fps = allFiles.filter((fp) => fp.endsWith(".md")).sort()
  console.log(
    `Found ${fps.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`,
  )

  const filePaths = fps.map((fp) => joinSegments(argv.directory, fp) as FilePath)
  ctx.allSlugs = allFiles.map((fp) => slugifyFilePath(fp as FilePath))

  const parsedFiles = await parseMarkdown(ctx, filePaths)
  const filteredContent = filterContent(ctx, parsedFiles)

  const dependencies: Dependencies = {}

  // Only build dependency graphs if we're doing a fast rebuild
  if (argv.fastRebuild) {
    const staticResources = getStaticResourcesFromPlugins(ctx)
    for (const emitter of ctx.cfg.plugins.emitters) {
      dependencies[emitter.name] =
        (await emitter.getDependencyGraph?.(ctx, filteredContent, staticResources)) ?? null
    }
  }

  await emitContent(ctx, filteredContent)
  console.log(chalk.green(`Done processing ${fps.length} files in ${perf.timeSince()}`))
  release()

  if (argv.serve) {
    return startServing(ctx, mut, parsedFiles, clientRefresh, dependencies)
  }
}

async function startServing(
  ctx: BuildCtx,
  mut: Mutex,
  initialContent: ProcessedContent[],
  clientRefresh: () => void,
  dependencies: Dependencies, // emitter name: dep graph
): Promise<void> {
  const { argv } = ctx
  const isIgnored = await isGitIgnored({ cwd: argv.directory })
  const contentMap = new Map<FilePath, ProcessedContent>()
  const trackedAssets = new Set<FilePath>()
  const initialSlugs = ctx.allSlugs

  for (const [tree, file] of initialContent) {
    const fp = file.data.filePath!
    contentMap.set(fp, [tree, file])
  }

  const buildData = {
    ctx,
    ignored: isIgnored,
    dependencies,
    contentMap,
    mut,
    initialSlugs,
    trackedAssets,
    toRebuild: new Set<FilePath>(),
    toRemove: new Set<FilePath>(),
    lastBuildMs: 0,
  }

  const watcher = chokidar.watch(".", {
    persistent: true,
    cwd: argv.directory,
    ignoreInitial: true,
  })

  watcher
    .on("add", (fp) => rebuildFromEntrypoint(fp, "add", clientRefresh, buildData))
    .on("change", (fp) => rebuildFromEntrypoint(fp, "change", clientRefresh, buildData))
    .on("unlink", (fp) => rebuildFromEntrypoint(fp, "delete", clientRefresh, buildData))

  return new Promise((resolve, reject) => {
    watcher.on("error", reject).on("ready", resolve)
  })
}

async function rebuildFromEntrypoint(
  fp: string,
  action: FileEvent,
  clientRefresh: () => void,
  buildData: {
    ctx: BuildCtx
    ignored: GlobbyFilterFunction
    dependencies: Dependencies
    contentMap: Map<FilePath, ProcessedContent>
    mut: Mutex
    initialSlugs: FullSlug[]
    trackedAssets: Set<FilePath>
    toRebuild: Set<FilePath>
    toRemove: Set<FilePath>
    lastBuildMs: number
  },
): Promise<void> {
  const { ctx, ignored, mut, initialSlugs, contentMap, toRebuild, toRemove, trackedAssets } =
    buildData

  const { argv } = ctx

  // don't do anything for gitignored files
  if (await ignored(fp)) {
    return
  }

  // dont bother rebuilding for non-content files, just track and refresh
  fp = toPosixPath(fp)
  const filePath = joinSegments(argv.directory, fp) as FilePath
  if (path.extname(fp) !== ".md") {
    if (action === "add" || action === "change") {
      trackedAssets.add(filePath)
    } else if (action === "delete") {
      trackedAssets.delete(filePath)
    }
    clientRefresh()
    return
  }

  const release = await mut.acquire()
  try {
    if (action === "add" || action === "change") {
      toRebuild.add(filePath)
    } else if (action === "delete") {
      toRemove.add(filePath)
    }

    const buildId = newBuildId()
    ctx.buildId = buildId

    const currentTime = new Date().getTime()
    const timeSinceLastBuild = currentTime - buildData.lastBuildMs
    const shouldDebounce = timeSinceLastBuild < 150

    if (shouldDebounce) {
      release()
      return
    }

    buildData.lastBuildMs = currentTime

    const perf = new PerfTimer()

    // update content map and rebuild files await parseMarkdown
    if (toRebuild.size > 0) {
      const newContent = await parseMarkdown(ctx, Array.from(toRebuild))
      for (const [tree, file] of newContent) {
        contentMap.set(file.data.filePath!, [tree, file])
      }
    }

    // remove files that were deleted
    for (const fp of toRemove) {
      contentMap.delete(fp)
    }

    // get slugs to check
    const allSlugs = new Set<FullSlug>([
      ...initialSlugs,
      ...[...contentMap.values()].map((content) => content[1].data.slug!),
    ])
    ctx.allSlugs = [...allSlugs]

    const filteredContent = filterContent(ctx, [...contentMap.values()])
    await emitContent(ctx, filteredContent)
    console.log(
      chalk.green(
        `Done rebuilding ${toRebuild.size} files and removing ${
          toRemove.size
        } files in ${perf.timeSince()}`,
      ),
    )

    toRebuild.clear()
    toRemove.clear()
    clientRefresh()
  } catch (err) {
    trace(`\nError while rebuilding \`${fp}\``, err as Error)
  } finally {
    release()
  }
}

export default async (argv: Argv, mut: Mutex, clientRefresh: () => void): Promise<void> => {
  try {
    return await buildQuartz(argv, mut, clientRefresh)
  } catch (err) {
    trace("\\nExiting Quartz due to a fatal error", err as Error)
  }
}
