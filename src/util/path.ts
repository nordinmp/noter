import path from 'path'
import { slug } from 'github-slugger'

export function resolveToRoot(slug: string): string {
  let fp = slug
  if (fp.endsWith("/index")) {
    fp = fp.slice(0, -"/index".length)
  }

  const newPath = fp
    .split(path.posix.sep)
    .map(_ => '..')
    .join(path.posix.sep)
  return "./" + newPath 
}

export function relativeToRoot(slug: string, fp: string): string {
  return path.join(resolveToRoot(slug), fp)
}

// mostly from https://github.com/withastro/astro/blob/dc31b8a722136eff90a600380a6419a37808d614/packages/astro/src/content/utils.ts#L213
export function slugify(fp: string): string {
  const withoutFileExt = fp.replace(new RegExp(path.extname(fp) + '$'), '')
  const rawSlugSegments = withoutFileExt.split(path.sep)
  const slugParts: string = rawSlugSegments
    .map((segment) => slug(segment))
    .join(path.posix.sep)
    .replace(/\/index$/, '')
  return path.normalize(slugParts)
}

export function slugFromPath(dir: string, fullPath: string): string {
  return slugify(path.relative(dir, fullPath))
}

export function relative(src: string, dest: string): string {
  return path.relative(src, dest)
}
