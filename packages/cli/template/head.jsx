/** @jsx h */
import { h, Fragment } from 'preact'

/** @type {import("@jackyzha0/quartz-lib").QuartzConfig["components"]["head"]} */
export default function({ pageData, externalResources }) {
  const { css, js } = externalResources
  return <head>
    <title>{pageData.frontmatter?.title}</title>
    {css.map(href => <link key={href} href={href} rel="stylesheet" type="text/css" />)}
    {js.map(resource => <script key={resource.src} src={resource.src} />)}
  </head>
}
