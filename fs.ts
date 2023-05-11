import path from 'path'

export const CONFIG_NAME = "quartz.config.json"
export const getConfigFilePath = (directory: string) => path.resolve(path.join(directory, CONFIG_NAME))
