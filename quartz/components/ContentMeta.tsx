import { Date as DateComponent } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { ValidLocale } from "../i18n"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const wordCount = fileData.frontmatter?.wordCount ?? 0
    const segments: (string | JSX.Element)[] = []
    const locale = (cfg.configuration.locale ?? "en-US") as ValidLocale

    if (fileData.frontmatter?.date) {
      try {
        const date = new Date(fileData.frontmatter.date)
        if (!isNaN(date.getTime())) {
          segments.push(<DateComponent date={date} locale={locale} />)
        }
      } catch (e) {
        console.warn("Invalid date in frontmatter:", fileData.frontmatter.date)
      }
    }

    // Show reading time if enabled and we have a word count
    if (options.showReadingTime && wordCount > 0) {
      const readingTime = Math.ceil(wordCount / 200) // Assuming average reading speed of 200 words per minute
      segments.push(`${readingTime} min read`)
    }

    // Handle commas between segments
    const segmentsWithCommas = segments.reduce<(string | JSX.Element)[]>((acc, segment, idx) => {
      if (idx === 0) return [segment]
      if (options.showComma) {
        return [...acc, ", ", segment]
      } else {
        return [...acc, " • ", segment]
      }
    }, [])

    if (segments.length === 0) {
      return null
    }

    return <p class={classNames(displayClass, "content-meta")}>{segmentsWithCommas}</p>
  }

  ContentMetadata.css = style
  return ContentMetadata
}) satisfies QuartzComponentConstructor
