import { ProcessedContent, QuartzFilterPlugin } from "../types";

export class RemoveDrafts extends QuartzFilterPlugin {
  shouldPublish([_tree, vfile]: ProcessedContent): boolean {
    const draftFlag: boolean = vfile.data?.frontmatter?.draft ?? false
    return !draftFlag
  }
}
