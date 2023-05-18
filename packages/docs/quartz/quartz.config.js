import { FrontMatter, GitHubFlavoredMarkdown, CreatedModifiedDate, Katex } from '@jackyzha0/quartz-plugins'
import pageSingle from './pageSingle'
import pageList from './pageList'
import pageHome from './pageHome'
import document from './document'

export default {
  plugins: [
    new FrontMatter(),
    new GitHubFlavoredMarkdown(),
    new Katex(),
    new CreatedModifiedDate({
      priority: ['frontmatter', 'filesystem']
    })],
  configuration: {
    quartzVersion: "4.0.0",
    name: "Jacky",
    hydrateInteractiveComponents: true,
    ignorePatterns: [],
  },
  components: {
    pageSingle,
    pageList,
    pageHome,
    document
  }
}
