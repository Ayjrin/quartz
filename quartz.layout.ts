import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared between all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head,
  header: [
    Component.PageTitle,
    Component.MobileOnly(Component.Spacer),
    Component.Search,
    Component.Darkmode,
  ],
  afterBody: [],
  footer: Component.Footer,
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs,
    Component.ArticleTitle,
    Component.ContentMeta,
    Component.TagList,
  ],
  left: [
    Component.PageTitle,
    Component.MobileOnly(Component.Spacer),
    Component.Search,
    Component.Darkmode,
    Component.DesktopOnly(Component.TableOfContents),
  ],
  right: [
    Component.Graph,
    Component.Backlinks,
    Component.RecentNotes,
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs, Component.ArticleTitle, Component.ContentMeta],
  left: [
    Component.PageTitle,
    Component.MobileOnly(Component.Spacer),
    Component.Search,
    Component.Darkmode,
  ],
  right: [],
}
