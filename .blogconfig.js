export default {
  src: 'src',
  dist: 'dist',
  port: 12345,
  blog: {
    metaDelimiter: '---',
    output: '_site',
    layouts: 'layouts',
    cache: '_posts_cache',
    posts: 'posts',
    public: 'public',
    js: 'js'
  },
  routes: {
    posts: 'a',
    assets: 'assets',
    public: 'public',
    js: 'assets',
    tags: 'tags'
  }
}