import { defineConfig } from 'astro/config'
import preact from "@astrojs/preact"
import tailwind from "@astrojs/tailwind"
import { rehypeHeadingIds as slugifyHeaders } from '@astrojs/markdown-remark'
import generateIdsForHeadings from 'rehype-slug'
import linkHeadings from 'rehype-autolink-headings'
import wikilinks from 'remark-wiki-link'
import { slugFromPath, slugify, relativeToRoot, relative } from './src/util/path'
import { visit } from 'unist-util-visit'
import isAbsoluteUrl from 'is-absolute-url'
import quartzConfig from './quartz.config.mjs'

const usesRelativePaths = quartzConfig.pathResolution === 'relative'

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      compat: true
    }),
    tailwind()
  ],
  markdown: {
    remarkPlugins: [
      [wikilinks, {
        pageResolver: (name) => ([slugify(name)]),
        aliasDivider: '|',
        hrefTemplate: x => x
      }]
    ],
    rehypePlugins: [
      // link processing
      () => (tree, vfile) => {
        const curSlug = slugFromPath(vfile.cwd, vfile.history[0])
        visit(tree, 'element', (node, _index, _parent) => {
          if (
            node.tagName === 'a' &&
            node.properties &&
            typeof node.properties.href === 'string'
          ) {
            if (!isAbsoluteUrl(node.properties.href)) {
              const targetSlug = slugify(decodeURI(node.properties.href))
              if (usesRelativePaths) {
                node.properties.href = relativeToRoot(curSlug, targetSlug)
              } else {
                node.properties.href = relative(curSlug, targetSlug)
              }
            }
          }
        })
      },
      slugifyHeaders,
      generateIdsForHeadings,
      [linkHeadings, { content: '#' }],
    ],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
})
