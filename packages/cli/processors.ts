import remarkParse from 'remark-parse'
import { Processor, unified } from 'unified'
import remarkRehype from 'remark-rehype'
import { Actions, Data, QuartzFilterPlugin, QuartzTransformerPlugin, getPluginName } from '@jackyzha0/quartz-plugins'
import { Root as MDRoot } from 'remark-parse/lib'
import { Root as HTMLRoot } from 'hast'
import { read } from 'to-vfile'
import path from 'path'
import { pathToSlug } from '@jackyzha0/quartz-lib'
import { ProcessedContent } from '@jackyzha0/quartz-lib/types'
import { createBuildPageAction } from './renderer'
import { QuartzConfig } from './config'

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

export async function processMarkdown(processor: QuartzProcessor, baseDir: string, fps: string[], verbose: boolean): Promise<ProcessedContent<Data>[]> {
  const res: ProcessedContent<Data>[] = []
  for (const fp of fps) {
    const file = await read(fp)

    // base data properties that plugins may use
    file.data.slug = pathToSlug(path.relative(baseDir, file.path))
    file.data.filePath = fp

    const ast = processor.parse(file)
    res.push([await processor.run(ast, file), file])

    if (verbose) {
      console.log(`[process] ${fp} -> ${file.data.slug}`)
    }
  }
  return res
}

export function filterContent(plugins: QuartzFilterPlugin[], content: ProcessedContent<Data>[]): ProcessedContent<Data>[] {
  for (const plugin of plugins) {
    content = content.filter(plugin.shouldPublish)
  }
  return content
}

export async function emitContent(directory: string, cfg: QuartzConfig, content: ProcessedContent<Data>[], verbose: boolean) {
  const actions: Actions = {
    buildPage: createBuildPageAction(directory, cfg)
  }

  let emittedFiles = 0 
  for (const emitter of cfg.plugins.emitters) {
    const emitted = await emitter.emit(content, actions)
    emittedFiles += emitted.length 

    if (verbose) {
      const pluginName = getPluginName(emitter)
      for (const file of emitted) {
        console.log(`[emit:${pluginName}] ${file}`)
      }
    }
  }

  return emittedFiles
}
