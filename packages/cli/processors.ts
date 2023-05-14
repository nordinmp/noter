import remarkParse from 'remark-parse'
import { unified, Processor } from 'unified'
import remarkRehype from 'remark-rehype/lib'
import rehypeStringify from 'rehype-stringify/lib'
import rehypeDocument, { Options as RehypeDocumentOptions } from 'rehype-document'
import { QuartzPlugin } from '@jackyzha0/quartz-plugins'

export async function markdownProcessor(plugins: QuartzPlugin[]) {
  let processor: Processor = unified().use(remarkParse)
  for (const plugin of plugins) {
    processor = processor.use(plugin.instantiatePlugin())
  }

  return processor
}

export async function htmlProcessor(opts: RehypeDocumentOptions) {
  let processor: Processor = unified()
    .use(remarkRehype)
    .use(rehypeDocument, opts)
    .use(rehypeStringify)
  return processor
}
