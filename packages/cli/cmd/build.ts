import { globbyStream } from "globby"
import { ArgumentsCamelCase, InferredOptionTypes } from "yargs"
import { commonFlags } from "./flags"
import { readConfigFile } from "../config"
import { index } from "../indexer"
import { markdownProcessor, htmlProcessor } from "../processors"
import path from "path"

export const TEXT_FILE_EXTS = [".md"]

export const BuildArgv = {
  ...commonFlags, output: {
    string: true,
    alias: ['o'],
    default: 'public',
    describe: 'output folder for files'
  }
}
export async function buildQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof BuildArgv>>) {
  const { directory } = argv
  const cfg = await readConfigFile(directory)

  if (argv.verbose) {
    console.log(`Building with the following plugins: ${cfg.enabledPlugins.join(", ")}`)
  }

  const mdTransform = await markdownProcessor(cfg.enabledPlugins)

  for await (const result of globbyStream("**", {
    cwd: directory,
    ignore: cfg.ignorePatterns,
    onlyFiles: false,
    markDirectories: true,
  })) {
    const fp = result.toString()
    const ext = path.extname(fp)

    if (TEXT_FILE_EXTS.includes(ext)) {
      const vfile = await index(mdTransform, fp)
      console.log(vfile)
    }
  }
}
