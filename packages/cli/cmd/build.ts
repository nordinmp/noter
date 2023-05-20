import { globby } from "globby"
import { ArgumentsCamelCase, InferredOptionTypes } from "yargs"
import { commonFlags } from "./flags"
import { readConfigFile } from "../config"
import { rimraf } from "rimraf"
import { createProcessor, emitContent, filterContent, processMarkdown } from "../processors"
import path from "path"
import { PerfTimer } from "../util"
import { Actions, getPluginName } from "@jackyzha0/quartz-plugins"
import { createBuildPageAction } from "../renderer"
import chalk from "chalk"

export const BuildArgv = {
  ...commonFlags,
  output: {
    string: true,
    alias: ['o'],
    default: 'public',
    describe: 'output folder for files'
  },
  clean: {
    boolean: true,
    default: false,
    describe: 'clean the output folder before building'
  },
  serve: {
    boolean: true,
    default: false,
    describe: 'run a local server to preview your Quartz'
  }
}

export async function buildQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof BuildArgv>>) {
  const perf = new PerfTimer()
  const cfg = await readConfigFile(argv.directory)

  if (argv.verbose) {
    const pluginCount = Object.values(cfg.plugins).flat().length
    const pluginNames = (key: 'transformers' | 'filters' | 'emitters') => cfg.plugins[key].map(getPluginName)
    console.log(`Loaded ${pluginCount} plugins (${perf.timeSince('start')})`)
    console.log(`  Transformers: ${pluginNames('transformers').join(", ")}`)
    console.log(`  Filters: ${pluginNames('filters').join(", ")}`)
    console.log(`  Emitters: ${pluginNames('emitters').join(", ")}`)
  }

  if (argv.clean) {
    perf.addEvent('clean')
    await rimraf(argv.output)
    console.log(`Cleaned output directory \`${argv.output}\` (${perf.timeSince('clean')})`)
  }

  // glob all md, implicitly ignore quartz folder
  perf.addEvent('processMarkdown')
  const fps = await globby('**/*.md', {
    cwd: argv.directory,
    ignore: [...cfg.configuration.ignorePatterns, 'quartz/**'],
    gitignore: true,
  })

  // generate hast nodes with markdown-side plugins
  const processor = createProcessor(cfg.plugins.transformers)
  const filePaths = fps.map(fp => `${argv.directory}${path.sep}${fp}`)
  const processedContent = await processMarkdown(processor, filePaths, argv.verbose)
  console.log(`Parsed and transformed ${processedContent.length} Markdown files (${perf.timeSince('processMarkdown')})`)

  perf.addEvent('filterContent')
  const filteredContent = filterContent(cfg.plugins.filters, processedContent)
  console.log(`Filtered out ${processedContent.length - filteredContent.length} files (${perf.timeSince('filterContent')})`)

  // run emitters
  perf.addEvent('emitContent')
  const emittedContent = await emitContent(argv.output, cfg, filteredContent, argv.verbose)
  console.log(`Emitted ${emittedContent.length} files to \`${argv.output}\` (${perf.timeSince('emitContent')})`)
  console.log(chalk.green(`Done in ${perf.timeSince('start')}`))
}

