import { cwd } from 'process'

interface BlogConfig {
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
  },
  route: {
    posts: string
    assets: string
    public: string
  }
}

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as BlogConfig

export default config