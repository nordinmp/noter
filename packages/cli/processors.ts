import remarkParse from 'remark-parse'
import { createElement, Fragment } from 'react'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { QuartzPlugin } from '@jackyzha0/quartz-plugins'
import { Processor } from 'unified'
import { Root as HTMLRoot } from 'hast'
import { Root as MDRoot } from 'remark-parse/lib'
import { JSResource, StaticResources } from '@jackyzha0/quartz-plugins/types'

export type QuartzProcessor = Processor<MDRoot, MDRoot, HTMLRoot, React.ReactElement<unknown>>
export async function markdownProcessor(plugins: QuartzPlugin[]): Promise<QuartzProcessor> {
  // base Markdown -> MD AST
  let processor = unified()
    .use(remarkParse)

  // MD AST -> MD AST transforms
  for (const plugin of plugins) {
    processor = processor.use(plugin.markdownPlugins())
  }

  // MD AST -> HTML AST
  processor = processor.use(remarkRehype, { allowDangerousHtml: true })


  // HTML AST -> HTML AST transforms
  for (const plugin of plugins) {
    processor = processor.use(plugin.htmlPlugins())
  }

  // HTML AST -> React Nodes
  return processor
    .use(rehypeReact, {
      createElement,
      Fragment,
    })
}

export function getStaticResourcesFromPlugins(plugins: QuartzPlugin[]) {
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
