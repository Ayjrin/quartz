import { QuartzComponent, QuartzComponentProps } from "./types"
import style from "./styles/darkmode.scss"

export const Darkmode: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={`darkmode ${displayClass ?? ""}`}>
      <input
        class="toggle"
        id="darkmode-toggle"
        type="checkbox"
        tabIndex={-1}
      />
      <label class="toggle-label" for="darkmode-toggle">
        <span class="toggle-label-background"></span>
      </label>
    </div>
  )
}

Darkmode.css = style
export default Darkmode
