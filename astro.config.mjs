import { defineConfig } from 'astro/config'
import preact from "@astrojs/preact"
import tailwind from "@astrojs/tailwind"
import { rehypeHeadingIds as slugifyHeaders } from '@astrojs/markdown-remark'
import generateIdsForHeadings from 'rehype-slug'
import linkHeadings from 'rehype-autolink-headings'
import wikilinks from '@flowershow/remark-wiki-link'
import { slugFromPath, slugify, relativeToRoot, relative, isAbsolute } from './src/util/path'
import { visit } from 'unist-util-visit'
import isAbsoluteUrl from 'is-absolute-url'
import quartzConfig from './quartz.config.mjs'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { globbyStream } from 'globby'
import fs from 'fs'
import path from 'path'
import { rimraf } from 'rimraf'

const usesRelativePaths = quartzConfig.pathResolution === 'relative'
const { enableLatex } = quartzConfig

// ast type defs
/** @typedef {import('remark-math')} */

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      compat: true
    }),
    tailwind(),
    {
      name: 'copy-images-to-public',
      hooks: {
        "astro:config:setup": async (options) => {
          const assetsPath = path.join("public", "assets")
          if (!options.isRestart) {
            await rimraf(assetsPath)
          }

          // glob all non MD/MDX/HTML files in content folder and copy it over
          for await (const fp of globbyStream("**", {
            ignore: ["**/*.{md,mdx,html}"],
            cwd: "./src/content/quartz",
          })) {
            const src = path.join("src", "content", "quartz", fp)
            const dest = path.join(assetsPath, fp)
            const dir = path.dirname(dest)
            await fs.promises.mkdir(dir, { recursive: true }) // ensure dir exists
            await fs.promises.copyFile(src, dest)
          }
        }
      }
    }
  ],
  markdown: {
    remarkPlugins: [
      [wikilinks, {
        pageResolver: (name) => ([slugify(name)]),
        pathFormat: usesRelativePaths ? 'raw' : 'obsidian-absolute'
      }],
      ...enableLatex ? [remarkMath] : [],
    ],
    rehypePlugins: [
      // relative link processing
      () => (tree, vfile) => {
        const curSlug = slugFromPath(vfile.cwd, vfile.history[0])
        const transformLink = (target) => {
          if (!isAbsoluteUrl(target)) {
            const targetSlug = slugify(decodeURI(target))
            if (usesRelativePaths && !isAbsolute(targetSlug)) {
              return './' + relative(curSlug, targetSlug)
            } else {
              return './' + relativeToRoot(curSlug, targetSlug)
            }
          }
        }

        // rewrite all links
        visit(tree, 'element', (node, _index, _parent) => {
          if (
            node.tagName === 'a' &&
            node.properties &&
            typeof node.properties.href === 'string'
          ) {
            node.properties.href = transformLink(node.properties.href)
          }
        })
        
        // transform all images
        visit(tree, 'element', (node, _index, _parent) => {
          if (
            node.tagName === 'img' &&
            node.properties &&
            typeof node.properties.src === 'string'
          ) {
            const ext = path.extname(node.properties.src)
            node.properties.src = transformLink("/assets/" + node.properties.src) + ext
          }
        })
      },
      slugifyHeaders,
      generateIdsForHeadings,
      // TODO: fix this
      [linkHeadings, { content: '#' }],
      ...enableLatex ? [[rehypeKatex, { output: 'html' }]] : []
    ],
    shikiConfig: {
      theme: 'github-dark'
    }
  },
  experimental: {
    assets: true
  }
})
