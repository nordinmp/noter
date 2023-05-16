export default function({ data, children }) {
  return <html>
    <head>
      <title>{data.frontmatter.title}</title>
    </head>
    <body>
      {children}
    </body>
  </html>
}
