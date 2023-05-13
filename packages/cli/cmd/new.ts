import fs from 'fs'
import { confirm, input } from '@inquirer/prompts'
import { QuartzConfig, getConfigFilePath } from '../config'
import chalk from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import { InferredOptionTypes } from 'yargs'
import { commonFlags } from './flags'
import { version } from '../package.json'

export const SetupArgv = { ...commonFlags }
export async function setupQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof SetupArgv>>) {
  const configFilePath = getConfigFilePath(argv.directory)
  if (fs.existsSync(configFilePath)) {
    const answer = await confirm({ message: "A Quartz config file `quartz.config.json` already exists in this directory. Overwrite it?" })
    if (answer === false) {
      return
    }
  }

  const name = await input({ message: "Your name (for author attribution and footer):" })
  const baseUrl = await input({
    message: "Base URL (protocol, host, path, and trailing slash) of your published site:",
    default: "https://www.example.org/docs/",
    validate: (url: string): boolean | string => {
      if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        return "URL must start with either http:// or https://"
      }
      if (!url.endsWith("/")) {
        return `Include a trailing slash (${url}/)`
      }
      return true
    }
  })

  const defaultConfig: QuartzConfig = {
    version,
    baseUrl,
    name,
    ignorePatterns: [],
    enabledPlugins: ["frontmatter"]
  }

  await fs.promises.writeFile(configFilePath, JSON.stringify(defaultConfig, null, 4))
  console.log(`${chalk.green("Successfully initialized Quartz")} (wrote ${configFilePath})`)
}
