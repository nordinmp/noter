import { Plugin } from "unified"
import { OutputType, QuartzPlugin } from "./types"
import { VFile } from "vfile"
import fs from "fs"
import { promisify } from "util"
import { exec as execCb } from 'child_process'
const exec = promisify(execCb)

export interface Options {
  priority: ('frontmatter' | 'git' | 'filesystem')[],
}

const defaultOptions: Options = {
  priority: ['frontmatter', 'git', 'filesystem']
}

export class CreatedModifiedDate extends QuartzPlugin {
  public output: OutputType = 'in-memory'
  opts: Options

  constructor(opts: Options) {
    super()
    this.opts = opts
  }

  instantiatePlugin(): Plugin {
    return () => {
      return async (_tree, file) => {
        let created: undefined | Date = undefined
        let modified: undefined | Date = undefined
        let published: undefined | Date = undefined

        const { priority } = {
          ...defaultOptions,
          ...this.opts,
        }

        const path = file.data.filePath as string
        for (const source of priority) {
          if (source === "filesystem") {
            const st = await fs.promises.stat(path)
            created ||= new Date(st.birthtimeMs)
            modified ||= new Date(st.mtimeMs)
          } else if (source === "frontmatter" && file.data.frontmatter) {
            created ||= file.data.frontmatter.date
            modified ||= file.data.frontmatter.lastmod
            modified ||= file.data.frontmatter["last-modified"]
            published ||= file.data.frontmatter.publishDate
          } else if (source === "git") {
            const { stdout } = await exec(`git log --pretty=format:%ci --follow -- "${path}"`)
            const lines = stdout.split("\n")
            if (lines.length > 0) {
              modified ||= new Date(lines[0])
              created ||= new Date(lines.pop()!)
            }
          }
        }

        file.data.dates = {
          created: created ?? new Date(),
          modified: modified ?? new Date(),
          published: published ?? new Date()
        }
      }
    }
  }

  getData(_documents: VFile[]): undefined {
    return undefined
  }
}

declare module 'vfile' {
  interface DataMap {
    dates: {
      created: Date
      modified: Date
      published: Date
    }
  }
}

