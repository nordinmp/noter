/** @jsx h */
import { h, Fragment } from 'preact'

/** @type {import("@jackyzha0/quartz-plugins").TypedComponent<"pageSingle">} */
export default function({ pageData }) {
  return <article>
    <h1>{pageData.frontmatter?.title}</h1>
  </article>
}
