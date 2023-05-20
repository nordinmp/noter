import { StaticResources } from '@jackyzha0/quartz-lib/types'
import { QuartzEmitterPlugin, QuartzFilterPlugin, QuartzTransformerPlugin } from './types'

export function getStaticResourcesFromPlugins(plugins: QuartzTransformerPlugin[]) {
  const staticResources: StaticResources = {
    css: [],
    js: [],
  }

  for (const plugin of plugins) {
    const res = plugin.externalResources
    if (res?.js) {
      staticResources.js = staticResources.js.concat(res.js)
    }
    if (res?.css) {
      staticResources.css = staticResources.css.concat(res.css)
    }
  }

  return staticResources
}

export function getPluginName(plugin: QuartzTransformerPlugin | QuartzFilterPlugin | QuartzEmitterPlugin) {
  return plugin.constructor.name.replace(/[0-9]+$/g, '')
}

export * from './types'
export * from './transformers'
export * from './filters'
export * from './emitters'

declare module 'vfile' {
  // inserted in processors.ts
  interface DataMap {
    slug: string
    filePath: string
  }
}

