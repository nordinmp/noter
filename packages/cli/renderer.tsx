import { h } from 'preact'
import { Actions } from "@jackyzha0/quartz-plugins/types"
import { render } from 'preact-render-to-string'
import { QuartzConfig } from "./config"
import { getStaticResourcesFromPlugins } from '@jackyzha0/quartz-plugins'
import { JSResource } from '@jackyzha0/quartz-lib/types'
import path from 'path'
import fs from 'fs'
import { HYDRATION_SCRIPT } from './hydration'
import { resolveToRoot } from '@jackyzha0/quartz-lib'

export function createBuildPageAction(outputDirectory: string, cfg: QuartzConfig): Actions["buildPage"] {
  return async ({ slug, ext, title, description, componentName, props }) => {
    const hydrationData = cfg.configuration.hydrateInteractiveComponents
      ? <script id="__QUARTZ_HYDRATION_DATA__" type="application/quartz-data" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          props,
          componentName
        })
      }} />
      : null

    const pathToRoot = resolveToRoot(slug)
    const staticResources = getStaticResourcesFromPlugins(cfg.plugins.transformers)
    if (cfg.configuration.hydrateInteractiveComponents) {
      staticResources.js.push({
        src: path.join(pathToRoot, HYDRATION_SCRIPT),
        loadTime: 'afterDOMReady'
      })
    }

    const Head = cfg.components.head
    const component = cfg.components[componentName]

    // @ts-ignore TODO: how do i make this typecheck
    const element = h(component, props)

    const doc = <html id="quartz-root">
      <Head title={title} description={description} baseDir={pathToRoot} externalResources={staticResources} />
      <body id="quartz-body" >
        {element}
        {hydrationData}
        {staticResources.js.filter(resource => resource.loadTime === "afterDOMReady").map((resource: JSResource) => <script key={resource.src} src={resource.src} />)}
      </body>
    </html>

    const pathToPage = path.join(outputDirectory, slug + ext)
    const dir = path.dirname(pathToPage)
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(pathToPage, "<!DOCTYPE html>\n" + render(doc))
    return pathToPage
  }
}
