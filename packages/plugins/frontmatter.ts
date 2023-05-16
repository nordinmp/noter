import { Plugin } from "unified"
import matter from "gray-matter"
import { OutputType, QuartzPlugin } from "./types"
import { VFile } from "vfile"

export interface Options {
  language: 'yaml' | 'toml',
  delims: string | string[]
}

const defaultOptions: Options = {
  language: 'yaml',
  delims: ['---', '---']
}

export class FrontMatter extends QuartzPlugin {
  public output: OutputType = 'in-memory'
  opts: Options

  constructor(opts: Options) {
    super()
    this.opts = opts
  }

  instantiatePlugin(): Plugin {
    return () => {
      return (_tree, file) => {
        const { content, data } = matter(file.value, { ...defaultOptions, ...this.opts })

        // update to exclude frontmatter from file content 
        file.value = content

        // fill in frontmatter
        file.data.frontmatter = {
          title: file.stem ?? "Untitled",
          tags: [],
          ...data
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
    frontmatter: { [key: string]: any } & {
      title: string
      tags: string[]
    }
  }
}

