export default {
  root: '.',
  server: {
    port: 12345
  },
  compiler: {
    src: 'src',
    dist: 'dist'
  },
  blog: {
    layouts: 'layouts',
    posts: 'posts',
    cache: '_posts_cache',
    output: '_site',
    metaDelimiter: '---'
  }
}