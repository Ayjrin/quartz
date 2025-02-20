import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzComponentWrapper } from "./types"

const DesktopOnly: QuartzComponentWrapper = (component) => {
  const DesktopOnlyComponent: QuartzComponent = (props) => {
    return component({ ...props, displayClass: "desktop-only" })
  }

  DesktopOnlyComponent.css = component.css
  DesktopOnlyComponent.beforeDOMLoaded = component.beforeDOMLoaded
  DesktopOnlyComponent.afterDOMLoaded = component.afterDOMLoaded

  return DesktopOnlyComponent
}

export default DesktopOnly
