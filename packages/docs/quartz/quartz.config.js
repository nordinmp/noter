import { FrontMatter, GitHubFlavoredMarkdown, CreatedModifiedDate } from '@jackyzha0/quartz-plugins'
import pageSingle from './pageSingle'
import pageList from './pageList'
import pageHome from './pageHome'
import document from './document'

export default {
  plugins: [
    new FrontMatter(),
    new GitHubFlavoredMarkdown(),
    new CreatedModifiedDate({
      priority: ['frontmatter']
    })],
  configuration: {
    quartzVersion: "4.0.0",
    name: "Jacky",
    ignorePatterns: [],
  },
  components: {
    pageSingle,
    pageList,
    pageHome,
    document
  }
}
