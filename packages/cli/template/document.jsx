import { h, Fragment } from 'preact'

const toScriptTag = (resource) => <script key={resource.src} src={resource.src} />

export default function({ data, staticResources, shouldHydrate, componentName, children }) {
  const { css, js } = staticResources

  const hydrationScript = shouldHydrate ?
      <script id="__QUARTZ_HYDRATION_DATA__" type="application/quartz-data" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          props: data,
          componentName
        })
      }}></script> :
      null

  return <html id="quartz-root">
    <head>
      <title>{data.frontmatter.title}</title>
      {css.map(href => <link key={href} href={href} rel="stylesheet" type="text/css" />)}
      {js.filter(resource => resource.loadTime === "beforeDOMReady").map(toScriptTag)}
    </head>
    <body id="quartz-body">
      {children}
      {hydrationScript}
      {js.filter(resource => resource.loadTime === "afterDOMReady").map(toScriptTag)}
    </body>
  </html>
}
