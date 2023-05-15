import { Plugin } from "unified";
import matter from "gray-matter"
import { OutputType, QuartzPlugin } from "./types";
import { VFile } from "vfile";

export interface Options {
  language: 'yaml' | 'toml',
  delims: string | string[]
}

const defaultOptions: Options = {
  language: 'yaml',
  delims: '---'
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
        const { content, data } = matter(file.value, this.opts ?? defaultOptions)

        // update to exclude frontmatter from file content 
        file.value = content
        file.data.frontmatter = data
      }
    }
  }

  getData(_documents: VFile[]): undefined {
    return undefined
  }
}

declare module 'vfile' {
  interface DataMap {
    frontmatter: { [key: string]: any }
  }
}

