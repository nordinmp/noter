import { PluggableList } from 'unified'
import { Node, VFile } from 'vfile/lib'

export interface JSResource {
  src: string
  loadTime: 'beforeDOMReady' | 'afterDOMReady'
}

export interface StaticResources {
  css: string[],
  js: JSResource[]
}

export abstract class QuartzTransformerPlugin {
  abstract markdownPlugins(): PluggableList
  abstract htmlPlugins(): PluggableList
  externalResources?: Partial<StaticResources>
}

export type ProcessedContent = [Node, VFile]
export abstract class QuartzFilterPlugin {
  abstract shouldPublish(content: ProcessedContent): boolean
}

export abstract class QuartzEmitterPlugin {

}
