interface BlogConfig {
  root: string
  compiler: {
    src: string
    dist: string
  }
  blog: {
    posts: string
  }
}

export default BlogConfig