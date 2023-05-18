import { ProcessedContent, QuartzFilterPlugin } from "../types";

export class ExplicitPublish extends QuartzFilterPlugin {
  shouldPublish([_tree, vfile]: ProcessedContent): boolean {
    const publishFlag: boolean = vfile.data?.frontmatter?.publish ?? false
    return publishFlag 
  }
}
