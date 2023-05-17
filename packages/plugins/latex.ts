import { PluggableList } from "unified"
import { OutputType, QuartzPlugin, StaticResources } from "./types"
import { VFile } from "vfile"
import remarkMath from "remark-math"
import rehypeKatex from 'rehype-katex'

export class Katex extends QuartzPlugin {
  output: OutputType = 'in-memory'

  markdownPlugins(): PluggableList {
    return [remarkMath]
  }

  htmlPlugins(): PluggableList {
    return [rehypeKatex]
  }

  externalResources: Partial<StaticResources> = {
    css: [
      // base css
      "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css",
    ],
    js: [
      {
        // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
        src: "https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/copy-tex.min.js",
        loadTime: "afterDOMReady"
      }
    ]
  }

  getData(_documents: VFile[]): undefined {
    return undefined
  }
}

