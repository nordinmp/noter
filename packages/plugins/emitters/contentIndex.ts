import { ProcessedContent } from "@jackyzha0/quartz-lib/types"
import { Actions, QuartzEmitterPlugin } from "../types"

export class ContentIndex extends QuartzEmitterPlugin {
  async emit(content: ProcessedContent[], actions: Actions): Promise<string[]> {
    return []
  }
}
