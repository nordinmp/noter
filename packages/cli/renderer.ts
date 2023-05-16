import fs from 'fs'
import path from 'path'
import { read } from 'to-vfile'
import { VFile } from 'vfile'
import { QuartzProcessor, StaticResources } from './processors'
import { Attributes, ComponentType, ReactElement } from 'react'
import { pathToSlug } from '../lib'
import { renderToPipeableStream } from 'react-dom/server'
import React from 'react'
import { Writable } from 'stream'
import { logPromise } from '../lib'

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
  document: ComponentType,
  component: ComponentType,
  staticResources: StaticResources,
  verbose: boolean,
}

export async function build({
  processor,
  inputPath,
  outputDir,
  document,
  component,
  staticResources,
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
    component,
    { data } as Attributes,
    articleElement as ReactElement
  )
  const fullDocument = React.createElement(
    document,
    {
      data,
      staticResources
    } as Attributes,
    fullComponent)
  await logPromise(verbose, renderToStream(stream, fullDocument), `rendering component to HTML: ${fullPath}`)
}

declare module 'vfile' {
  interface DataMap {
    slug: string
    filePath: string
  }
}
