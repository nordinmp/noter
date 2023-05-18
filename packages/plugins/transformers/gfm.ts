import { PluggableList } from "unified"
import { QuartzTransformerPlugin } from "../types"
import remarkGfm from "remark-gfm"

export class GitHubFlavoredMarkdown extends QuartzTransformerPlugin {
  markdownPlugins(): PluggableList {
    return [remarkGfm]
  }

  htmlPlugins(): PluggableList {
    return []
  }
}
