import { QuartzComponent, QuartzComponentProps } from "./types"
import { i18n, defaultTranslation } from "../i18n"
import type { ValidLocale } from "../i18n"
import style from "./styles/backlinks.scss"
import { resolveRelative, type FilePath, slugifyFilePath } from "../util/path"

interface BacklinksOptions {
  /**
   * Whether to hide the backlinks component when there are no backlinks to display
   */
  hideIfEmpty: boolean
}

const defaultOptions: BacklinksOptions = {
  hideIfEmpty: false,
}

export default ((opts?: Partial<BacklinksOptions>) => {
  // Merge options with defaults
  const options: BacklinksOptions = { ...defaultOptions, ...opts }

  const Backlinks: QuartzComponent = ({ fileData, allFiles, cfg, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug as FilePath
    const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug))
    const locale = (cfg.configuration.locale ?? defaultTranslation) as ValidLocale

    if (options.hideIfEmpty && backlinkFiles.length === 0) {
      return null
    }

    return (
      <div class={`backlinks ${displayClass ?? ""}`}>
        <h3>{i18n(locale).components.backlinks.title}</h3>
        <ul class="overflow">
          {backlinkFiles.length > 0 ? (
            backlinkFiles.map((file) => {
              const currentSlug = slugifyFilePath(slug)
              const targetSlug = slugifyFilePath(file.slug as FilePath)
              return (
                <li>
                  <a href={resolveRelative(currentSlug, targetSlug)}>{file.frontmatter?.title || file.slug}</a>
                </li>
              )
            })
          ) : (
            <li>{i18n(locale).components.backlinks.noBacklinksFound}</li>
          )}
        </ul>
      </div>
    )
  }

  Backlinks.css = style
  return Backlinks
})
