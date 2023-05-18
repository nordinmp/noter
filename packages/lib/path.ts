import path from 'path'

// Replaces all whitespace with dashes and URI encodes the rest
export function pathToSlug(fp: string) {
  const { dir, name } = path.parse(fp)
  let slug = path.join('/', dir, name)
  slug = slug.replace(/\s/g, '-')
  return slug
}

