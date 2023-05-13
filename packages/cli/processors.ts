import chalk from 'chalk'
import remarkParse from 'remark-parse'
import { unified, Processor } from 'unified'
import remarkRehype from 'remark-rehype/lib'
import rehypeStringify from 'rehype-stringify/lib'
import rehypeDocument, { Options as RehypeDocumentOptions } from 'rehype-document'
import { PLUGINS, QUARTZ_PLUGIN_NAMES, ValidPluginName } from './plugins'

export async function markdownProcessor(plugins: ValidPluginName[]) {
  let processor: Processor = unified().use(remarkParse)

  for (const plugin of plugins) {
    if (QUARTZ_PLUGIN_NAMES.includes(plugin)) {
      processor = processor.use(PLUGINS[plugin])
    } else {
      console.log(`${chalk.red("Couldn't resolve plugin")} ${plugin}`)
      console.log("hint: check to see if you made a typo or if you need to update Quartz")
      process.exit(1)
    }
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
