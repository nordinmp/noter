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
    quartzVersion: "{{quartzVersion}}",
    name: "{{name}}",
    ignorePatterns: [],
  },
  components: {
    pageSingle,
    pageList,
    pageHome,
    document
  }
}
