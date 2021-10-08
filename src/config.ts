import { cwd } from 'process'

interface TConfig {
  port: string
  src: string
  dist: string
  blog: {
    layouts: string
    layoutsComponents: string
    posts: string
    postAssets: string
    cache: string
    output: string
    metaDelimiter: string
    public: string
    js: string
  },
  routes: {
    [property: string]: string
    posts: string
    postAssets: string
    page: string
    assets: string
    public: string
    js: string
    tags: string
    timeline: string
    category: string
  }
}

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as TConfig

export default config
export type { TConfig }