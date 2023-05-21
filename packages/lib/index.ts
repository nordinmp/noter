import path from 'path'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Node } from 'hast-util-to-jsx-runtime/lib'
import { Fragment, jsx, jsxs} from 'preact/jsx-runtime'

// Replaces all whitespace with dashes and URI encodes the rest
export function pathToSlug(fp: string) {
  const { dir, name } = path.parse(fp)
  let slug = path.join('/', dir, name)
  slug = slug.replace(/\s/g, '-')
  return slug
}

export function astToJsx(node: Node) {
  return toJsxRuntime(node, {
    Fragment,
    jsx: jsx as Parameters<typeof toJsxRuntime>[1]["jsx"],
    jsxs: jsxs as Parameters<typeof toJsxRuntime>[1]["jsxs"],
    development: false,
    elementAttributeNameCase: 'html'
  })
}
