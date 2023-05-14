import path from 'path'
import requireFromString from 'require-from-string'
import chalk from 'chalk'
import { version } from './package.json'
import esbuild from 'esbuild'
import t, { Infer } from 'myzod'
import fs from 'fs'
import { QuartzPlugin } from '@jackyzha0/quartz-plugins'

export interface UserProvidedConfig {
  quartzVersion: string,
  baseUrl: string,
  name: string,
}

const configSchema = t.object({
  quartzVersion: t.string(),
  baseUrl: t.string(),
  name: t.string(),
  ignorePatterns: t.array(t.string()),
})

export interface QuartzConfig {
  plugins: QuartzPlugin[],
  configuration: Infer<typeof configSchema>
}

export const isValidBaseUrl = (url: string): boolean | string => {
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    return "URL must start with either http:// or https://"
  }
  if (!url.endsWith("/")) {
    return `Include a trailing slash (${url}/)`
  }
  return true
}

function isValidConfig(cfg: any): cfg is QuartzConfig {
  const requiredKeys = ["plugins", "configuration"]
  for (const key of requiredKeys) {
    if (!cfg.hasOwnProperty(key)) {
      console.log(`${chalk.yellow("Warning:")} Configuration is missing required key \`${key}\``)
      return false
    }
  }

  const validationResult = configSchema.try(cfg.configuration)
  if (validationResult instanceof t.ValidationError) {
    console.log(`${chalk.yellow("Warning:")} Configuration doens't match schema. ${validationResult.message}`)
    return false
  }

  return true
}

export const QUARTZ = "quartz"
export const QUARTZ_CONFIG_NAME = "quartz.config.js"
export function getQuartzPath(directory: string) {
  return path.resolve(path.join(directory, QUARTZ))
}

export function getConfigFilePath(directory: string) {
  return path.resolve(path.join(directory, QUARTZ, QUARTZ_CONFIG_NAME))
}

export async function readConfigFile(directory: string): Promise<QuartzConfig> {
  const fp = path.resolve(path.join(directory, QUARTZ, QUARTZ_CONFIG_NAME))
  const out = await esbuild.build({
    entryPoints: [fp],
    bundle: true,
    format: "cjs",
    sourcemap: "inline",
  }).catch(err => {
    console.log(`${chalk.red("Couldn't read Quartz configuration:")} ${fp}`)
    console.log(`Reason: ${chalk.grey(err)}`)
    console.log("hint: you can initialize a new Quartz with `quartz new`")
    process.exit(1)
  })

  const mod = out.outputFiles![0].text
  const cfg: QuartzConfig = requireFromString(mod)
  if (!isValidConfig(cfg)) {
    console.log(chalk.red("Invalid Quartz configuration"))
    process.exit(1)
  }

  if (cfg.configuration.quartzVersion !== version) {
    console.log(`${chalk.yellow("Warning:")} version in configuration (${cfg.configuration.quartzVersion}) is different from current Quartz version (${version}). Proceed with caution!`)
    console.log("hint: visit https://github.com/jackyzha0/quartz/blob/v4/config.ts to see the most up-to-date schema")
  }

  return cfg
}

export async function templateQuartzFolder(quartzDirectory: string, cfg: UserProvidedConfig) {
  const parentFolder = path.join(__dirname, "template")
  // copy over files 
  await fs.promises.cp(parentFolder, quartzDirectory, { recursive: true })

  // insert template 
}

