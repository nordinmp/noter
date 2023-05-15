import { Plugin } from 'unified'
import { VFile } from 'vfile'
export type OutputType = 'in-memory' | 'as-file'
export abstract class QuartzPlugin<ReduceType = undefined> {
  public abstract output: OutputType
  abstract instantiatePlugin(): Plugin

  // Reduce over all the documents to produce a final state
  abstract getData(documents: VFile[]): ReduceType
}

