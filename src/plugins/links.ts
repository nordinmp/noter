import type { RehypePlugin } from "@astrojs/markdown-remark"
import wikilinks from '@flowershow/remark-wiki-link'
import { slugFromPath, slugify, relativeToRoot, relative, isAbsolute } from '../util/path'
import isAbsoluteUrl from "is-absolute-url"
import quartzConfig from "../../quartz.config.mjs"
import { visit } from 'unist-util-visit'
import path from 'path'

const usesRelativePaths = quartzConfig.pathResolution === 'relative'
export const processRelativeLinks: () => ReturnType<RehypePlugin> = () => (tree, vfile) => {
  const curSlug = slugFromPath(vfile.cwd, vfile.history[0])
  const transformLink = (target: string) => {
    if (!isAbsoluteUrl(target)) {
      const targetSlug = slugify(decodeURI(target))
      if (usesRelativePaths && !isAbsolute(targetSlug)) {
        return './' + relative(curSlug, targetSlug)
      } else {
        return './' + relativeToRoot(curSlug, targetSlug)
      }
    }
    return target
  }

  // rewrite all links
  visit(tree, 'element', (node, _index, _parent) => {
    if (
      node.tagName === 'a' &&
      node.properties &&
      typeof node.properties.href === 'string'
    ) {
      node.properties.className = isAbsoluteUrl(node.properties.href) ? "external" : "internal"
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
}

export const wikilinkPreset = [wikilinks, {
  pageResolver: (name: string) => ([slugify(name)]),
  pathFormat: usesRelativePaths ? 'raw' : 'obsidian-absolute'
}]
