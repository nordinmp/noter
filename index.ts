import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { setupQuartz } from './cmd/new'

// common flags
const directoryFlag = {
  directory: {
    string: true,
    alias: ['d'],
    default: '.',
    describe: 'directory to look for content files'
  }
}

// parse cli args
yargs(hideBin(process.argv)).scriptName("quartz")
  .usage('$0 <cmd> [args]')
  .command(
    'new',
    'Setup a new Quartz',
    { ...directoryFlag },
    ({ directory }) => setupQuartz(directory))
  .command('build', 'Build Quartz into a bundle of static HTML files', { ...directoryFlag }, (argv) => {

  })
  .command('preview', 'Preview current Quartz locally', { ...directoryFlag }, (argv) => {

  })
  .help()
  .strict()
  .demandCommand()
  .argv
