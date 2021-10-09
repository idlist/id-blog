export default {
  src: 'src',
  dist: 'dist',
  port: 12345,
  blog: {
    metaDelimiter: '---',
    output: '_site',
    layouts: 'layouts',
    layoutsComponents: 'layouts-components',
    cache: '_posts_cache',
    posts: 'posts',
    postAssets: 'post-assets',
    public: 'public',
    js: 'js'
  },
  routes: {
    posts: 'a',
    postAssets: 'pa',
    page: 'p',
    assets: 'assets',
    public: 'public',
    js: 'assets',
    tags: 'tags',
    timeline: 'tl',
    category: 'category'
  }
}