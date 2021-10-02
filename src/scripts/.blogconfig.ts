interface BlogConfig {
  root: string
  compiler: {
    src: string
    dist: string
  }
  blog: {
    posts: string
    cache: string
    output: string
    metaDelimiter: string
  }
}

export default BlogConfig