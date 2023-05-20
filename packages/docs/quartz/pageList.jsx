/** @jsx h */
import { h, Fragment } from 'preact'

/** @type {import("@jackyzha0/quartz-lib").QuartzConfig["components"]["pageList"]} */
export default function({ pagesData }) {
  return <div>
    <ul>
      {pagesData.map((pageData) => <li>
        <a href={pageData.slug}>{pageData.frontmatter?.title}</a>
      </li>)}
    </ul>
  </div>
}
