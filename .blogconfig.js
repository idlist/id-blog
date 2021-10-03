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
    public: 'public'
  },
  route: {
    posts: 'p',
    assets: 'assets',
    public: 'public'
  }
}