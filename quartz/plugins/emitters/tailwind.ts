import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { ProcessedContent } from "../../plugins/vfile"
import { BuildCtx } from "../../util/ctx"
import postcss from "postcss"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import fs from "fs/promises"

export const Tailwind: QuartzEmitterPlugin = () => ({
  name: "Tailwind",
  async emit({ argv }: BuildCtx, _content: ProcessedContent[], _props: QuartzComponentProps) {
    try {
      const css = await fs.readFile('./quartz/styles/tailwind.css', 'utf8')
      const result = await postcss([
        tailwindcss,
        autoprefixer,
      ]).process(css, {
        from: './quartz/styles/tailwind.css',
        to: './public/styles/tailwind.css'
      })

      await fs.mkdir('./public/styles', { recursive: true })
      await fs.writeFile('./public/styles/tailwind.css', result.css)
    } catch (err) {
      console.error('Error processing Tailwind CSS:', err)
    }
    
    return []
  },
  getQuartzComponents() {
    return []
  },
})
