import { ArgumentsCamelCase, InferredOptionTypes } from "yargs"
import { commonFlags } from "./flags"
import { readConfigFile } from "../config"

export const PreviewArgv = { ...commonFlags }
export async function previewQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof PreviewArgv>>) {
  const { directory } = argv
  const cfg = await readConfigFile(directory)
  console.log(cfg)
}
