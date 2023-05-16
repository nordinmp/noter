import { Plugin } from "unified"
import { OutputType, QuartzPlugin } from "./types"
import remarkGfm, { Root } from "remark-gfm"
import { VFile } from "vfile"

export class GitHubFlavoredMarkdown extends QuartzPlugin {
  public output: OutputType = 'in-memory'

  instantiatePlugin(): Plugin<[], Root> {
    return remarkGfm
  }

  getData(_documents: VFile[]): undefined {
    return undefined
  }
}
