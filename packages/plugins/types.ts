import { PluggableList } from 'unified'
import { VFile } from 'vfile'

export type OutputType = 'in-memory' | 'as-file'

export interface JSResource {
  src: string
  loadTime: 'beforeDOMReady' | 'afterDOMReady'
}

export interface StaticResources {
  css: string[],
  js: JSResource[]
}

export abstract class QuartzPlugin<ReduceType = undefined> {
  public abstract output: OutputType

  abstract markdownPlugins(): PluggableList 
  abstract htmlPlugins(): PluggableList 

  externalResources?: Partial<StaticResources>

  // Reduce over all the documents to produce a final state
  abstract getData(documents: VFile[]): ReduceType
}

