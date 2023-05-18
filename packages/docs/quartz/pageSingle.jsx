import { h, Fragment } from 'preact'

export default function({ data, children }) {
  return <article>
    <h1>{data.frontmatter.title}</h1>
    {children}
  </article>
}
