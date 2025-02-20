import { QuartzComponent, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"



// Use a static version if package.json import fails
const version = "4.0.0"

interface Options {
  links: Record<string, string>
}

const defaultOptions: Options = {
  links: {
    GitHub: "https://github.com/jackyzha0/quartz",
    "Discord Community": "https://discord.gg/cRFFHYye7t",
  },
}

export const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const year = new Date().getFullYear()
  const links = defaultOptions.links
  
  return (
    <footer class={`${displayClass ?? ""}`}>
      <hr />
      <p>
        Created with <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>, &copy; {year}
      </p>
      <ul>
        {Object.entries(links).map(([text, link]) => (
          <li>
            <a href={link}>{text}</a>
          </li>
        ))}
      </ul>
    </footer>
  )
}

Footer.css = style
export default Footer
