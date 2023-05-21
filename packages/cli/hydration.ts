import esbuild from 'esbuild'
import { getQuartzPath } from './config'

const hydrationScriptContent = `
import { h, hydrate } from 'preact'
import { components } from './quartz.config.js'

const hydrationDataNode = document.getElementById('__QUARTZ_HYDRATION_DATA__')
const { props, componentName} = JSON.parse(hydrationDataNode.innerText)
const component = components[componentName]
const element = h(component, props)
const domNode = document.getElementById('quartz-body')
hydrate(element, domNode)
`

export const HYDRATION_SCRIPT = "hydration.js"
export async function transpileHydrationScript(inputDirectory: string, outfile: string) {
  await esbuild.build({
    stdin: {
      contents: hydrationScriptContent,
      resolveDir: getQuartzPath(inputDirectory),
    },
    bundle: true,
    minify: true,
    platform: "browser",
    outfile,
    logLevel: 'error',
    // treeshaking plugin imports doesn't seem to work: https://github.com/evanw/esbuild/issues/1794
    plugins: [{
      name: "quartz-plugin-shim",
      setup(build) {
        build.onResolve({ filter: /^@jackyzha0\/quartz-plugins/ }, args => ({
          path: args.path,
          namespace: 'quartz-plugin-shim',
        }))
        build.onLoad({ filter: /.*/, namespace: 'quartz-plugin-shim' }, _args => ({
          contents: ""
        }))
      },
    }]
  })
}
