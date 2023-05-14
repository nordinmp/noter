import { FrontMatter } from '@jackyzha0/quartz-plugins'

export default {
  plugins: [new FrontMatter()],
  configuration: {
    quartzVersion: "{{quartzVersion}}",
    baseUrl: "{{baseUrl}}",
    name: "{{name}}",
    ignorePatterns: [],
  }
}
