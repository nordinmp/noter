import { Description, FrontMatter, GitHubFlavoredMarkdown, CreatedModifiedDate, Katex, RemoveDrafts, Page } from '@jackyzha0/quartz-plugins'
import pageSingle from './pageSingle'
import pageList from './pageList'
import pageHome from './pageHome'
import head from './head'

/** @type {import("@jackyzha0/quartz/config").QuartzConfig} */
export default {
  configuration: {
    // version of Quartz used to generate this file
    quartzVersion: "4.0.0",
    // your name
    name: "Jacky",
    // enables React hydration but may increase build times and bundle size 
    hydrateInteractiveComponents: true,
    // directories to exclude Quartz from parsing
    ignorePatterns: [],
  },
  plugins: {
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
  },
  components: {
    pageSingle,
    pageList,
    pageHome,
    head
  }
}
