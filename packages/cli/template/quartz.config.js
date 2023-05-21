import { Description, FrontMatter, GitHubFlavoredMarkdown, CreatedModifiedDate, Katex, RemoveDrafts, Page } from '@jackyzha0/quartz-plugins'
import pageSingle from './pageSingle'
import pageList from './pageList'
import pageHome from './pageHome'
import head from './head'

/** @type {import("@jackyzha0/quartz/config").QuartzConfig["configuration"]} */
export const configuration = {
  // version of Quartz used to generate this file
  quartzVersion: __quartzVersion,
  // your name
  name: __name,
  // enables React hydration but may increase build times and bundle size 
  hydrateInteractiveComponents: __hydrateInteractiveComponents,
  // directories to exclude Quartz from parsing
  ignorePatterns: [],
}

/** @type {import("@jackyzha0/quartz/config").QuartzConfig["plugins"]} */
export const plugins = {
  transformers: [
    new FrontMatter(),
    new GitHubFlavoredMarkdown(),
    new Katex(),
    new Description(),
    new CreatedModifiedDate({
      priority: ['frontmatter', 'filesystem']
    })],
  filters: [
    new RemoveDrafts()
  ],
  emitters: [
    new Page()
  ]
}

/** @type {import("@jackyzha0/quartz/config").QuartzConfig["components"]} */
export const components = {
  pageSingle,
  pageList,
  pageHome,
  head
}

/** @type {import("@jackyzha0/quartz/config").QuartzConfig} */
export const completeConfiguration = {
  configuration,
  plugins,
  components
}
