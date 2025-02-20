import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzComponentWrapper } from "./types"

const MobileOnly: QuartzComponentWrapper = (component) => {
  const MobileOnlyComponent: QuartzComponent = (props) => {
    return component({ ...props, displayClass: "mobile-only" })
  }

  MobileOnlyComponent.css = component.css
  MobileOnlyComponent.beforeDOMLoaded = component.beforeDOMLoaded
  MobileOnlyComponent.afterDOMLoaded = component.afterDOMLoaded

  return MobileOnlyComponent
}

export default MobileOnly
