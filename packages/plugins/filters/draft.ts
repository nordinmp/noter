import { ProcessedContent } from "@jackyzha0/quartz-lib/types"
import { QuartzFilterPlugin } from "../types"

export class RemoveDrafts extends QuartzFilterPlugin {
  shouldPublish([_tree, vfile]: ProcessedContent): boolean {
    const draftFlag: boolean = vfile.data?.frontmatter?.draft ?? false
    return !draftFlag
  }
}
