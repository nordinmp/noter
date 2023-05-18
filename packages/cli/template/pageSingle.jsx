import { h, Fragment } from 'preact'

export default function({ data, renderedHTMLString }) {
  return <article>
    <h1>{data.frontmatter.title}</h1>
    <div id="__QUARTZ_MAIN_CONTENT__" dangerouslySetInnerHTML={{ __html: renderedHTMLString }}></div>
  </article>
}
