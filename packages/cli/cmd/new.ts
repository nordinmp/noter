import fs from 'fs'
import { confirm, input } from '@inquirer/prompts'
import { getQuartzPath, isValidBaseUrl, templateQuartzFolder } from '../config'
import chalk from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import { InferredOptionTypes } from 'yargs'
import { commonFlags } from './flags'
import { version } from '../package.json'

export const SetupArgv = { ...commonFlags }
export async function setupQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof SetupArgv>>) {
  const quartzPath = getQuartzPath(argv.directory)
  if (fs.existsSync(quartzPath)) {
    const answer = await confirm({ message: `A Quartz folder \`${quartzPath}\` already exists in this directory. Overwrite it?` })
    if (answer === false) {
      return
    }
  }

  const name = await input({ message: "Your name (for author attribution and footer):" })
  const baseUrl = await input({
    message: "Base URL (protocol, host, path, and trailing slash) of your published site:",
    default: "https://www.example.org/docs/",
    validate: isValidBaseUrl
  })

  await templateQuartzFolder(quartzPath, {
    quartzVersion: version,
    baseUrl,
    name
  })

  console.log(`${chalk.green("Successfully initialized Quartz")} (wrote configuration and template files to ${quartzPath})`)
}
