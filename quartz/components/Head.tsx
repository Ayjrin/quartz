
import { QuartzComponent, QuartzComponentProps } from "./types"

interface HeadProps extends QuartzComponentProps {
  title?: string
  description?: string
  slug?: string
  image?: string
}

export const Head: QuartzComponent = ({ title, description, slug, image, cfg, fileData }: HeadProps) => {
  const baseUrl = cfg.configuration.baseUrl ?? ""
  const pageTitle = title ? `${title} | ${cfg.configuration.pageTitle}` : cfg.configuration.pageTitle
  const pageDescription = description ?? fileData?.description ?? `${cfg.configuration.pageTitle} - Digital Garden`
  const displayImage = image ?? `/static/og-image.png`
  const canonicalUrl = slug ? `${baseUrl}/${slug}` : baseUrl

  return (
    <head>
      <title>{pageTitle}</title>
      <meta charSet="utf-8" />
      {/* Meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {displayImage && <meta property="og:image" content={`${baseUrl}${displayImage}`} />}
      <meta property="og:width" content="1200" />
      <meta property="og:height" content="675" />
      <link rel="icon" href={`${baseUrl}/static/icon.png`} />
      <meta name="description" content={pageDescription} />
      <meta name="generator" content="Quartz" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Styles */}
      <link rel="stylesheet" href={`${baseUrl}/styles/custom.css`} />
      <link rel="stylesheet" href={`${baseUrl}/styles/base.css`} />
      <link rel="stylesheet" href={`${baseUrl}/styles/theme.css`} />
      
      {/* Scripts */}
      <script defer src={`${baseUrl}/prism.js`}></script>
      <script defer src={`${baseUrl}/scripts.js`}></script>
    </head>
  )
}

Head.css = ""
export default Head
