import fs from 'fs'
import { confirm, input } from '@inquirer/prompts'
import { QUARTZ, QUARTZ_CONFIG_NAME, getQuartzPath, templateQuartzFolder } from '../config'
import chalk from 'chalk'
import { ArgumentsCamelCase } from 'yargs'
import { InferredOptionTypes } from 'yargs'
import { commonFlags } from './flags'
import { version } from '../package.json'
import path from 'path'

export const SetupArgv = {
  ...commonFlags
}

export async function setupQuartz(argv: ArgumentsCamelCase<InferredOptionTypes<typeof SetupArgv>>) {
  const quartzPath = getQuartzPath(argv.directory)
  if (fs.existsSync(quartzPath)) {
    const answer = await confirm({ message: `A Quartz folder \`${quartzPath}\` already exists in this directory. Overwrite it?` })
    if (answer === false) {
      return
    }
  }

  const name = await input({ message: "Your name (for author attribution and footer):" })

  await templateQuartzFolder(argv.directory, {
    quartzVersion: version,
    name
  })

  console.log(`${chalk.green("Successfully initialized Quartz")} (wrote configuration and template files to ${quartzPath})`)
  console.log(`hint: You can find more advanced configuration options in \`${QUARTZ + path.sep + QUARTZ_CONFIG_NAME}\``)
}
