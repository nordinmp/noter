# Quartz

Host your second brain and [digital garden](https://jzhao.xyz/posts/networked-thought) for free. Quartz features

TODO: Flesh this out more with v4

*If you are looking for Quartz v3, you can find it on the [`hugo` branch](https://github.com/jackyzha0/quartz/tree/hugo).

Check out some of the [amazing gardens that community members](https://quartz.jzhao.xyz/notes/showcase/) have published with Quartz!

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

🔗 Get Started: https://quartz.jzhao.xyz/

![Quartz Example Screenshot](./screenshot.png)*Quartz Example Screenshot*

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Technical

Parsing a single file
1. Markdown file -(read)-> VFile
2. VFile -(remark-parse)-> MD AST
3. MD AST -(markdown plugins)-> MD AST
4. MD AST -(remark-rehype)-> HTML AST
5. HTML AST -(html plugins)-> HTML AST

Filters
- HTML AST + configuration -> HTML AST?
- determine whether to include content

Emitters
- HTML AST[] + configuration + actions { buildPage(base component, props) } -> static resources
  - page/content indexing for search
  - generate pages
    - build single page for each HTML AST entry
      - account for aliases here
    - build tag page for all pages with a certain tag
    - build list page for each directory (except for home page)
- build page
  - SSG HTML using preact render -> HTML string
    - has a document.jsx for templating (i.e. move document to cli)
    - include props for hydration as a script tag adjacent to body
    - include name of base component for rehydration import
  - client side hydration script 
    - dynamically load component from bundle
- static files 
  - copy over all non-md resource files unchanged
  - include hydration script imports default export from quartz.config.json and only selects the components field
    - let treeshaking take care of the rest
    - look for hydration props
    - lookup base component in components field 

Components (JSX) + Config File (JS)
- Typing with JSDOC + Typescript

Client side
- Hooks to load static resources (e.g. content index)

