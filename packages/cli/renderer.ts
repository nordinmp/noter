import fs from 'fs'
import path from 'path'
import { read } from 'to-vfile'
import { Data, VFile } from 'vfile'
import { QuartzProcessor } from './processors'
import { Attributes, ComponentType, ReactElement } from 'react'
import { pathToSlug } from '../lib'
import { renderToPipeableStream } from 'react-dom/server'
import React from 'react'
import { Writable } from 'stream'
import { QuartzConfig } from './config'
import { logPromise } from '../lib'

export async function index(processor: QuartzProcessor, fp: string): Promise<VFile> {
  const file = await read(fp)

  // base data properties that plugins may use
  file.data.slug = pathToSlug(file.path)
  file.data.filePath = fp

  return processor.process(file)
}

export function createComposedDocumentElement(document: ComponentType, component: ComponentType, article: ReactElement, data: Data) {
  const fullComponent = React.createElement(component, data as Attributes, article)
  const fullDocument = React.createElement(document, data as Attributes, fullComponent)
  return fullDocument
}

export async function renderToStream(dest: Writable, element: ReactElement) {
  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(element, {
      onAllReady: () => {
        resolve(pipe(dest))
      },
      onError: reject
    })
  })
}



export async function build(processor: QuartzProcessor, inputPath: string, outputDir: string, cfg: QuartzConfig, verbose: boolean) {
  if (verbose) {
    console.log(inputPath)
  }

  const indexPromise = index(processor, inputPath)
  const { data, result: articleElement } = await logPromise(verbose, indexPromise, "indexing")

  const fullPath = path.join(outputDir, data.slug! + ".html")
  const dir = path.parse(fullPath).dir 

  // attempt to make missing directory
  await fs.promises.mkdir(dir, { recursive: true })
  const stream = fs.createWriteStream(fullPath)
  const composedDocument = createComposedDocumentElement(
    cfg.components.document,
    cfg.components.pageSingle,
    articleElement as ReactElement,
    { data }
  )
  await logPromise(verbose, renderToStream(stream, composedDocument), `rendering component to HTML: ${fullPath}`)
}

declare module 'vfile' {
  interface DataMap {
    slug: string
    filePath: string
  }
}
