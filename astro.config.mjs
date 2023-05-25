import { defineConfig } from 'astro/config'
import preact from "@astrojs/preact"
import { rehypeHeadingIds as slugifyHeaders } from '@astrojs/markdown-remark'
import generateIdsForHeadings from 'rehype-slug'
import linkHeadings from 'rehype-autolink-headings'
import quartzConfig from './quartz.config.mjs'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import copyStaticAssets from './src/plugins/static'
import { processRelativeLinks, wikilinkPreset } from './src/plugins/links'
import rehypePrettyCode from 'rehype-pretty-code'
const { enableLatex } = quartzConfig

// ast type defs
/** @typedef {import('remark-math')} */

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      compat: true
    }),
    copyStaticAssets
  ],
  markdown: {
    remarkPlugins: [
      wikilinkPreset,
      ...enableLatex ? [remarkMath] : [],
    ],
    rehypePlugins: [
      [rehypePrettyCode, {
        theme: 'css-variables',
        onVisitLine(node) {
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(node) {
          node.properties.className.push('highlighted');
        },
        onVisitHighlightedWord(node) {
          node.properties.className = ['word'];
        },
      }],
      processRelativeLinks,
      slugifyHeaders,
      generateIdsForHeadings,
      [linkHeadings, { content: '#' }],
      ...enableLatex ? [[rehypeKatex, { output: 'html' }]] : []
    ],
    syntaxHighlight: false
  },
  experimental: {
    assets: true
  }
})
