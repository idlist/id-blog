export default {
  root: '.',
  compiler: {
    src: 'src',
    dist: 'dist',
    entryFile: 'scripts/build.js',
  },
  blog: {
    posts: 'posts',
    cache: '_posts_cache',
    output: '_site',
    metaDelimiter: '---'
  }
}