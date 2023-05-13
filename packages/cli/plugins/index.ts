import frontmatter from './frontmatter'

export const PLUGINS = {
  frontmatter,
}
export type ValidPluginName = keyof typeof PLUGINS
export const QUARTZ_PLUGIN_NAMES = Object.keys(PLUGINS) as Array<ValidPluginName>

