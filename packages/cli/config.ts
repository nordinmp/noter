import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { version } from './package.json'
import { confirm } from '@inquirer/prompts'
import { ValidPluginName } from './plugins'

/**
  * Shape of the Quartz configuration file. Normally in `quartz.config.json`
  */
export interface QuartzConfig {
  version: string,
  baseUrl: string,
  name: string,
  ignorePatterns: string[],
  enabledPlugins: ValidPluginName[],
}

function isValidConfig(cfg: any): cfg is QuartzConfig {
  if (cfg.version !== version) {
    console.log(`${chalk.yellow("Warning:")} version in configuration (${cfg.version}) is different from current Quartz version (${version}). Proceed with caution!`)
    console.log("hint: visit https://github.com/jackyzha0/quartz/blob/v4/config.ts to see the most up-to-date schema")
    return false
  }
  return true
}

export const CONFIG_NAME = "quartz.config.json"
export function getConfigFilePath(directory: string) {
  return path.resolve(path.join(directory, CONFIG_NAME))
}

export async function readConfigFile(directory: string): Promise<QuartzConfig> {
  const fp = getConfigFilePath(directory)
  const buf = await fs.promises.readFile(fp).catch(err => {
    console.log(`${chalk.red("Couldn't find a Quartz in the directory")} ${directory}`)
    console.log(`Reason: ${chalk.grey(err)}`)
    console.log("hint: you can initialize a new Quartz with `quartz new`")
    process.exit(1)
  })

  const cfg: QuartzConfig = JSON.parse(buf.toString())
  if (!isValidConfig(cfg)) {
    const answer = await confirm({ message: `${chalk.red("Invalid Quartz configuration.")} Continue anyways?` })
    if (!answer) {
      process.exit(1)
    }
  }
  return cfg
}

