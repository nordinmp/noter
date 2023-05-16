import { PluggableList } from "unified"
import { OutputType, QuartzPlugin } from "./types"
import remarkGfm from "remark-gfm"
import { VFile } from "vfile"

export class GitHubFlavoredMarkdown extends QuartzPlugin {
  public output: OutputType = 'in-memory'

  markdownPlugins(): PluggableList {
    return [remarkGfm]
  }
  htmlPlugins(): PluggableList {
    return []
  }

  getData(_documents: VFile[]): undefined {
    return undefined
  }
}
