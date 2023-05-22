import { astToJsx } from "@jackyzha0/quartz-lib/jsx"
import { useState } from 'preact/hooks'

/** @type {import("@jackyzha0/quartz-plugins").TypedComponent<"pageSingle">} */
export default function({ pageData, articleAstNode }) {
  const [clicks, setClicks] = useState(0)
  return <article>
    <h1>{pageData.frontmatter?.title}</h1>
    <p onClick={setClicks(clicks => clicks + 1)}>Clicks: {clicks}</p>
    {astToJsx(articleAstNode)}
  </article>
}
