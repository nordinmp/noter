import { globbyStream } from "globby"
import { ArgumentsCamelCase, InferredOptionTypes } from "yargs"
import { commonFlags } from "./flags"
import { readConfigFile } from "../config"
import { build } from "../renderer"
import { markdownProcessor } from "../processors"
import path from "path"
import chalk from "chalk"
import { rimraf } from "rimraf"

export const TEXT_FILE_EXTS = [".md"]

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
  }
}

export async function buildQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof BuildArgv>>) {
  const { directory } = argv
  const cfg = await readConfigFile(directory)

  if (argv.verbose) {
    const pluginNames = cfg.plugins.map(plugin => plugin.constructor.name)
    console.log(`${chalk.green(`Loaded ${pluginNames.length} plugins`)}: ${pluginNames.join(", ")}`)
  }

  if (argv.clean) {
    await rimraf(argv.output)
  }

  const processor = await markdownProcessor(cfg.plugins)
  for await (const globbedPath of globbyStream("**", {
    cwd: directory,
    ignore: cfg.configuration.ignorePatterns,
    onlyFiles: false,
    markDirectories: true,
  })) {
    const fp = globbedPath.toString()
    const ext = path.extname(fp)

    if (TEXT_FILE_EXTS.includes(ext)) {
      await build(processor, fp, argv.output, cfg, argv.verbose)
    }
  }
}
