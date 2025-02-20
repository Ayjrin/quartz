import { ComponentType } from "preact"
import { QuartzConfig } from "../cfg"
import { Node } from "hast"
import { BuildCtx } from "../util/ctx"
import { FilePath } from "../util/path"

export interface FilePluginData {
  frontmatter: { [key: string]: any }
  slug: string
  description?: string
  links: FilePath[]
}

export interface QuartzComponentProps {
  ctx: BuildCtx
  cfg: QuartzConfig
  fileData: FilePluginData
  children: (QuartzComponent | JSX.Element)[]
  tree: Node
  allFiles: FilePluginData[]
  displayClass?: "mobile-only" | "desktop-only"
  externalResources: {
    css: string[]
    js: {
      src: string
      loadTime: "beforeDOMReady" | "afterDOMReady"
      contentType?: string
    }[]
  }
}

export type QuartzComponent = ComponentType<QuartzComponentProps> & {
  css?: string | { [key: string]: string }
  beforeDOMLoaded?: string
  afterDOMLoaded?: string
}

export type QuartzComponentConstructor = () => QuartzComponent
