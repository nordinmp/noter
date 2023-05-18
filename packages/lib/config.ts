import t, { Infer } from 'myzod'
import { QuartzTransformerPlugin, QuartzEmitterPlugin, QuartzFilterPlugin } from '@jackyzha0/quartz-plugins'
import { RenderableProps } from 'preact'
import chalk from 'chalk'
import { Data, Node } from 'vfile/lib'
import { StaticResources } from '@jackyzha0/quartz-plugins'

export const configSchema = t.object({
  quartzVersion: t.string(),
  name: t.string(),
  hydrateInteractiveComponents: t.boolean(),
  ignorePatterns: t.array(t.string()),
})

export type FunctionComponent<T> = (props: RenderableProps<T>) => JSX.Element
export interface QuartzConfig {
  plugins: {
    transformers: QuartzTransformerPlugin[],
    filters: QuartzFilterPlugin[],
    emitters: QuartzEmitterPlugin[],
  },
  configuration: Infer<typeof configSchema>,
  components: {
    pageSingle: FunctionComponent<{
      pageData: Data,
      articleAstNode: Node
    }>,
    pageList: FunctionComponent<{
      pagesData: Data[],
    }>
    pageHome: QuartzConfig["components"]["pageSingle"],
    head: FunctionComponent<{
      pageData: Data,
      externalResources: StaticResources
    }>
  }
}

export function isValidConfig(cfg: any): cfg is QuartzConfig {
  const requiredKeys = ["plugins", "configuration", "components"]
  for (const key of requiredKeys) {
    if (!cfg.hasOwnProperty(key)) {
      console.log(`${chalk.yellow("Warning:")} Configuration is missing required field \`${key}\``)
      return false
    }
  }

  const requiredPlugins = ["transformers", "filters", "emitters"]
  for (const key of requiredPlugins) {
    if (!cfg.plugins.hasOwnProperty(key)) {
      console.log(`${chalk.yellow("Warning:")} Configuration is missing required field \`plugins.${key}\``)
      return false
    }
  }

  const requiredComponents = ["pageSingle", "pageList", "pageHome", "head"]
  for (const key of requiredComponents) {
    if (!cfg.components.hasOwnProperty(key)) {
      console.log(`${chalk.yellow("Warning:")} Configuration is missing required field \`components.${key}\``)
      return false
    }
  }

  const validationResult = configSchema.try(cfg.configuration)
  if (validationResult instanceof t.ValidationError) {
    console.log(`${chalk.yellow("Warning:")} Configuration doens't match schema. ${validationResult.message}`)
    return false
  }

  return true
}
