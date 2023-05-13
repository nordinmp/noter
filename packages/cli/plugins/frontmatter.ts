import { Plugin } from "unified";
import matter from "gray-matter"

const frontmatter: Plugin = () => {
  return (_tree, file) => {
    const { content, data } = matter(file.value)

    // update to exclude frontmatter from file content 
    file.value = content
    file.data.frontmatter = data
  }
}

declare module 'vfile' {
  interface DataMap {
    frontmatter: { [key: string]: any }
  }
}


export default frontmatter
