// import fs from 'fs'
// import path from 'path'
// import { read } from 'to-vfile'
// import { VFile } from 'vfile'
// import React from 'preact/compat'
// import { pathToSlug } from '../lib'
// import { logPromise } from '../lib'
// import { QuartzConfig } from './config'
// import { render } from 'preact-render-to-string'
// import { StaticResources } from '@jackyzha0/quartz-plugins/types'
//
// export interface BuildOptions {
//   processor: QuartzProcessor,
//   inputPath: string,
//   outputDir: string
//   cfg: QuartzConfig,
//   staticResources: StaticResources,
//   verbose: boolean,
// }
//
// export async function buildSingle({
//   processor,
//   inputPath,
//   outputDir,
//   staticResources,
//   cfg,
//   verbose
// }: BuildOptions) {
//   if (verbose) {
//     console.log(inputPath)
//   }
//
//   const indexPromise = processMarkdown(processor, inputPath)
//   const { data, result: articleElement } = await logPromise(verbose, indexPromise, "indexing")
//
//   const renderedHTMLString = render(articleElement as preact.VNode)
//   const fullPath = path.join(outputDir, data.slug! + ".html")
//   const dir = path.parse(fullPath).dir
//
//   // compose react elements
//   const fullComponent = React.createElement(
//     cfg.components.pageSingle,
//     { data, renderedHTMLString } as preact.Attributes,
//     articleElement as preact.VNode
//   )
//
//   const injectedResources: StaticResources = cfg.configuration.hydrateInteractiveComponents ?
//     {
//       css: staticResources.css,
//       js: [...staticResources.js]
//     } :
//     staticResources
//
//   const fullDocument = React.createElement(
//     cfg.components.document,
//     {
//       data,
//       staticResources: injectedResources,
//       componentName: 'pageSingle',
//       shouldHydrate: cfg.configuration.hydrateInteractiveComponents
//     } as preact.Attributes,
//     fullComponent)
//
//   // attempt to make missing directory
//   await fs.promises.mkdir(dir, { recursive: true })
//   await logPromise(verbose, fs.promises.writeFile(fullPath, render(fullDocument)), `rendering component to HTML: ${fullPath}`)
// }
