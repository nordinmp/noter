import chalk from 'chalk'
import pretty from 'pretty-time'

export async function logPromise<T>(verbose: boolean, p: Promise<T>, msg: string): Promise<T> {
  if (!verbose) {
    return p
  }

  process.stdout.write(chalk.grey(`  ${msg} ... `))
  return p
    .then((res) => {
      process.stdout.write(chalk.green("ok"))
      return res
    })
    .catch((res) => {
      process.stdout.write(chalk.red("err: ") + res.toString())
      return res
    })
    .finally(() => process.stdout.write("\n"))
}

export class PerfTimer {
  evts: { [key: string]: [number, number] }

  constructor() {
    this.evts = {}
    this.addEvent('start')
  }

  addEvent(evtName: string) {
    this.evts[evtName] = process.hrtime()
  }

  timeSince(evtName?: string): string {
    return chalk.yellow(pretty(process.hrtime(this.evts[evtName ?? 'start'])))
  }
}
