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
  }
}

export default BlogConfig