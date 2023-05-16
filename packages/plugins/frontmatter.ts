import { PluggableList } from "unified"
import matter from "gray-matter"
import remarkFrontmatter from 'remark-frontmatter'
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

  markdownPlugins(): PluggableList {
    return [
      remarkFrontmatter,
      () => {
        return (_, file) => {
          const { data } = matter(file.value, { ...defaultOptions, ...this.opts })

          // fill in frontmatter
          file.data.frontmatter = {
            title: file.stem ?? "Untitled",
            tags: [],
            ...data
          }
        }
      }
    ]
  }

  htmlPlugins(): PluggableList {
    return []
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

