import { cwd } from 'process'

interface TConfig {
  port: string
  src: string
  dist: string
  blog: {
    layouts: string
    posts: string
    cache: string
    output: string
    metaDelimiter: string
    public: string
    js: string
  },
  routes: {
    [property: string]: string
    posts: string
    assets: string
    public: string
    js: string
    tags: string
  }
}

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as TConfig

export default config
export type { TConfig }