const toScriptTag = (resource) => <script src={resource.src}/>

export default function({ data, staticResources, children }) {
  const { css, js } = staticResources

  return <html id="quartz-root">
    <head>
      <title>{data.frontmatter.title}</title>
      {css.map(href => <link href={href} rel="stylesheet" type="text/css" />)}
      {js.filter(resource => resource.loadTime === "beforeDOMReady").map(toScriptTag)}
    </head>
    <body>
      {children}
      {js.filter(resource => resource.loadTime === "afterDOMReady").map(toScriptTag)}
    </body>
  </html>
}
