import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
  const description = fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description
  const { css, js } = externalResources

  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const path = url.pathname as FullSlug

  const iconPath = joinSegments(pathToRoot(path), "static/icon.png")
  const ogImagePath = `https://${cfg.baseUrl}/static/og-image.webp`

  return (
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {cfg.baseUrl && <meta property="og:image" content={ogImagePath} />}
      <meta property="og:width" content="1200" />
      <meta property="og:height" content="675" />
      <link rel="icon" href={iconPath} />
      <meta name="description" content={description} />
      <meta name="generator" content="Quartz" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      {cfg.theme.fontOrigin === "googleFonts" && (
        <>
          <link rel="preload" href={googleFontHref(cfg.theme)} as="style" />
          <link href={googleFontHref(cfg.theme)} rel="stylesheet" />
        </>
      )}
      {css.map((resource) => CSSResourceToStyleElement(resource, true))}
      {js
        .filter((resource) => resource.loadTime === "beforeDOMReady")
        .map((res) => JSResourceToScriptElement(res, true))}
      <link href="/styles/tailwind.css" rel="stylesheet" type="text/css" spa-preserve />
    </head>
  )
}

export default (() => Head) satisfies QuartzComponentConstructor
