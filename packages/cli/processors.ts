import remarkParse from 'remark-parse'
import { Processor, unified } from 'unified'
import remarkRehype from 'remark-rehype'
import { QuartzFilterPlugin, QuartzTransformerPlugin,  } from '@jackyzha0/quartz-plugins'
import { Root as MDRoot } from 'remark-parse/lib'
import { Root as HTMLRoot } from 'rehype-react/lib'
import { read } from 'to-vfile'
import { pathToSlug } from '@jackyzha0/quartz-lib'
import { ProcessedContent } from '@jackyzha0/quartz-plugins'

export type QuartzProcessor = Processor<MDRoot, HTMLRoot, void>
export function createProcessor(plugins: QuartzTransformerPlugin[]): QuartzProcessor {
  // base Markdown -> MD AST
  let processor = unified().use(remarkParse)

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

  return processor as Processor<MDRoot, HTMLRoot, void>
}

export async function processMarkdown(processor: QuartzProcessor, fps: string[]): Promise<ProcessedContent[]> {
  return Promise.all(fps.map(async fp => {
    const file = await read(fp)

    // base data properties that plugins may use
    file.data.slug = pathToSlug(file.path)
    file.data.filePath = fp

    const ast = processor.parse(file)
    return [await processor.run(ast, file), file]
  }))
}

export function filterContent(plugins: QuartzFilterPlugin[], content: ProcessedContent[]): ProcessedContent[] {
  for (const plugin of plugins) {
    content = content.filter(plugin.shouldPublish)
  }
  return content
}
