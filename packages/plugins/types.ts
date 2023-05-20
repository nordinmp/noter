import { PluggableList } from 'unified'
import { StaticResources, ProcessedContent, ValidComponentName, ComponentTypes } from "@jackyzha0/quartz-lib/types"
import { Data } from 'vfile'
import { ComponentProps } from 'preact'
export { Data } from 'vfile'

export abstract class QuartzTransformerPlugin {
  abstract markdownPlugins(): PluggableList
  abstract htmlPlugins(): PluggableList
  externalResources?: Partial<StaticResources>
}

export abstract class QuartzFilterPlugin {
  abstract shouldPublish(content: ProcessedContent): boolean
}

export interface BuildPageOptions<T extends ValidComponentName<Data>> {
  // meta
  title: string
  description: string
  slug: string
  
  // hydration related
  componentName: T
  props: ComponentProps<ComponentTypes<Data>[T]>
}

export type Actions = {
  buildPage: <T extends ValidComponentName<Data>>(opts: BuildPageOptions<T>) => Promise<string>
}

export abstract class QuartzEmitterPlugin {
  abstract emit(content: ProcessedContent[], actions: Actions): Promise<string[]>
}

export interface PluginTypes {
  transformers: QuartzTransformerPlugin[],
  filters: QuartzFilterPlugin[],
  emitters: QuartzEmitterPlugin[],
}

export type TypedComponent<T extends ValidComponentName<Data>> = ComponentTypes<Data>[T]
