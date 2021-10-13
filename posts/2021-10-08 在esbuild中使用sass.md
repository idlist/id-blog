---
title: 在 esbuild 中使用 Sass
route: use-sass-in-esbuild
date: 2021-10-08
lastUpdate: 2021-10-13
tags: esbuild sass nodejs frontend_js
layout: article
---

[esbuild](https://esbuild.github.io/) 是一个非常快的 JavaScript 打包 / 转译器，虽然说覆盖的功能没有 Webpack 等老牌打包器全面，但是它足够用，配置简捷，而且最重要的是它实在是**太快了**。

而 [Sass](https://sass-lang.com/) 是一个常用的 CSS 扩展语言，优点有不用打分号和大括号、支持嵌套选择器和便利的 At-Rules。但是 Sass 并不能直接被浏览器识别，需要转译到 CSS。这篇文章主要分享一下我在 esbuild 配 Sass 的过程中遇到的一些问题。

## 原理

esbuild 自己是有 CSS 打包器的，它会识别 `@import` 规则和 `url()` 中的路径，并在 `bundle: true`（开启打包）的前提下将 CSS 打包成单一文件。

Sass 转译器的作用其实只是将 Sass 转译到 CSS，然后再将转译后的 CSS 递给 esbuild，进行后续处理。这一点相当重要，因为后面提到的问题的根源有很多在此。

最基础的 Sass 插件实现可以参照 [essass](https://github.com/fayismahmood/sassEs) 这个插件的 [`index.js`](https://github.com/fayismahmood/sassEs/blob/master/index.js)，源码简单粗暴。

## esbuild 的 Sass 插件

除了上面的 essass, 支持在 esbuild 中引入 Sass 的、常用的社区插件有两个：[esbuild-plugin-sass](https://github.com/koluch/esbuild-plugin-sass/) 和 [esbuild-sass-plugin](https://github.com/glromeo/esbuild-sass-plugin/)。在只转译 Sass 的前提下，两个插件的转译结果是一致的。而在速度上，单次构建时 esbuild-plugin-sass 的速度更快，在热重载环境下（即配置了 `watch: true` 或者 `incremental: true` 的情况下）esbuild-sass-plugin 的后续构建速度更快。

另一方面，esbuild-sass-plugin 提供了更多的功能（如支持 PostCSS 和 `lit-css` 等），如果有这些需求，就只能选择 esbuild-sass-plugin 了。

## 常见问题

#### Q: 为什么有些 Sass 的配置项不起作用？

这里的“有些配置项”是指的 `outputStyle`, `indentType`, `indentWidth` 等用于调整输出格式的配置项。因为 Sass 转译器只是将 Sass 转译成 CSS，接下来 esbuild 会接着处理转译后的 CSS。所以即使在 Sass 中设置了一道输出格式，也会被上游的 esbuild 覆盖。

也就是说，真正起作用的是 esbuild 中的 `minify`。如果想实现 Sass 中 `outputStyle: compressed` 的效果，那么应该在 esbuild 中设置 `minify: true`。如果有其他对于输出格式的需求，则可能需要使用其他的工具，直接对 esbuild 的输出结果进行二次处理。

#### Q: 如何处理 Sass 中引用的静态资源？

其实这个问题等价于“如何处理 CSS 中引用的静态资源”，然后因为 CSS 是由 esbuild 处理，所以这个问题又转化为“如何处理 esbuild 中引用的静态资源”。

首先，一般情况下我们还是想把 CSS 文件打包成单一文件（即 `bundle: true`）。在打包的前提下，esbuild 中引用静态文件一共有 2 个常用的解决方案。在下面，我们假设这个静态文件为字体 `my-font.woff2`。

###### **1.** 使用 Data URL loader 或者 File loader

Data URL loader 会将静态文件通过 base64 编码成字符串，并内嵌进 CSS 中，而 File loader 会将静态文件复制至根目录（配置项 `outdir`，若没有配置则为最近公共目录）下，并改写 `@import` 和 `url()` 的路径以匹配新的文件位置。在 esbuild 中，需要手动对 `loader` 配置项进行配置以在文件中引用对应后缀名的静态文件，如 `loader: { '.woff2': 'dataurl' }` 或者 `loader: { '.woff2': 'file' }`。前者用更大的 CSS 文档换取了更少的请求数，而后者则反过来，具体选择哪种则是萝卜白菜了。

###### **2.** 设置路径为 `external` 并手动复制静态文件

如果不满足于 Data URL loader 增加 CSS 的大小或者 File loader 给静态文件的名字中加 hash 的行为（而且还找不到地方关掉），那么可以考虑准备一个 `public` 文件夹，在最后输出的时候手动复制这个文件夹到输出目录（比如用 Node.js v16.7 最新最酷炫的 [`fs.cp`](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_fspromises_cp_src_dest_options)）。

这样做的话，为了让 esbuild 在打包的时候忽略掉这个 `public` 文件夹，需要设置对应的 [`external`](https://esbuild.github.io/api/#external) 配置项。而值得注意的是，`external` 的路径需要和 `@import` 与 `url()` 中的路径严格匹配。比如说，在 `@font-face` 中这样创建了一个新字体：

```sass
@font-face
  font-family: 'My Font'
  font-weight: normal
  src: url('/public/fonts/my-font.woff2')
```

此处的 `url()` 是字体文件相对输出目录根目录的路径。那么应该配置：

```js
esbuild.build({
  // ...other configurations
  external: ['/public/*']
})
```

配置 `external: ['public/*']` 则并不会让 esbuild 忽略 `/public/*`，因为它们本来就是两个不同的路径。在这个配置下，`url('public/...')` 才会被忽略。当然，也可以选择直接配置 `external: ['/*']`，然后所有静态文件的路径全写成相对根目录的路径。我反正是这么做了，不过就不作推荐了，只是说有这么一回事。

最后，在不打包的情况下，esbuild 则不会对 `@import` 和 `url()` 中的路径进行处理，该怎样就怎样。