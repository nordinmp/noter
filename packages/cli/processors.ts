import remarkParse from 'remark-parse'
import { createElement, Fragment } from 'react'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { QuartzPlugin } from '@jackyzha0/quartz-plugins'
import { Processor } from 'unified'
import { Root as HTMLRoot } from 'hast'
import { Root as MDRoot } from 'remark-parse/lib'

export type QuartzProcessor = Processor<MDRoot, MDRoot, HTMLRoot, React.ReactElement<unknown>>
export async function markdownProcessor(plugins: QuartzPlugin[]): Promise<QuartzProcessor> {
  // base Markdown -> MD AST
  let processor = unified()
    .use(remarkParse)

  // MD AST -> MD AST transforms
  for (const plugin of plugins) {
    processor = processor.use(plugin.instantiatePlugin())
  }

  // MD AST -> HTML AST -> React Nodes
  return processor
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeReact, {
      createElement,
      Fragment,
    })
}

