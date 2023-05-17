import fs from 'fs'
import path from 'path'
import { read } from 'to-vfile'
import { VFile } from 'vfile'
import { QuartzProcessor } from './processors'
import { Attributes, ComponentType, ReactElement } from 'react'
import { pathToSlug } from '../lib'
import { renderToPipeableStream } from 'react-dom/server'
import React from 'react'
import { Writable } from 'stream'
import { logPromise } from '../lib'
import { QuartzConfig } from './config'
import { StaticResources } from '@jackyzha0/quartz-plugins/types'
import esbuild, { transform } from 'esbuild'
import util from 'util'

export async function processMarkdown(processor: QuartzProcessor, fp: string): Promise<VFile> {
  const file = await read(fp)

  // base data properties that plugins may use
  file.data.slug = pathToSlug(file.path)
  file.data.filePath = fp

  return processor.process(file)
}

export async function renderToStream(dest: Writable, element: ReactElement) {
  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(element, {
      onAllReady: () => {
        resolve(pipe(dest))
      },
      onError: reject,
    })
  })
}

export interface BuildOptions {
  processor: QuartzProcessor,
  inputPath: string,
  outputDir: string
  cfg: QuartzConfig,
  staticResources: StaticResources,
  verbose: boolean,
}

export async function buildSingle({
  processor,
  inputPath,
  outputDir,
  staticResources,
  cfg,
  verbose
}: BuildOptions) {
  if (verbose) {
    console.log(inputPath)
  }

  const indexPromise = processMarkdown(processor, inputPath)
  const { data, result: articleElement } = await logPromise(verbose, indexPromise, "indexing")

  const fullPath = path.join(outputDir, data.slug! + ".html")
  const dir = path.parse(fullPath).dir

  // attempt to make missing directory
  await fs.promises.mkdir(dir, { recursive: true })
  const stream = fs.createWriteStream(fullPath)

  // compose react elements
  const fullComponent = React.createElement(
    cfg.components.pageSingle,
    { data } as Attributes,
    articleElement as ReactElement
  )

  const fullDocument = React.createElement(
    cfg.components.document,
    {
      data,
      staticResources
    } as Attributes,
    fullComponent)

  if (cfg.configuration.hydrateInteractiveComponents) {
    console.log(util.inspect(fullDocument, false, null, true))
    const transpiledResult = await esbuild.transform(`
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('quartz-root');
const root = hydrateRoot(domNode, ${fullDocument});
`, {})
    console.log(transpiledResult.code)
  }

  await logPromise(verbose, renderToStream(stream, fullDocument), `rendering component to HTML: ${fullPath}`)
}

declare module 'vfile' {
  interface DataMap {
    slug: string
    filePath: string
  }
}
