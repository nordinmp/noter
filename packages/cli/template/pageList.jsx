import { h, Fragment } from 'preact'

export default function({ pages }) {
  return <div>
    <ul>
      {pages.map(({ data }) => <li>
        <a href={data.slug}>{data.frontmatter.title}</a>
      </li>)}
    </ul>
  </div>
}
