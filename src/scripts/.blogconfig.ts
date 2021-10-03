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

export default BlogConfig