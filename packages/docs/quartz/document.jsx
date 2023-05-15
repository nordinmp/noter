export default function({ children, data }) {
  return <html>
    <head>
      <title>{data.frontmatter.title}</title>
    </head>
    <body>
      {children}
    </body>
  </html>
}
