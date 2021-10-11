---
title: 在 esbuild 中使用 Sass
route: use-sass-in-esbuild
date: 2021-10-08
tags: esbuild sass nodejs frontend_js
layout: article
---

[esbuild](https://esbuild.github.io/) 是一个非常快的 JavaScript 打包 / 转译器，虽然说覆盖的功能没有 Webpack 等老牌打包器全面，但是它足够用，配置简捷，而且最重要的是它实在是**太快了**。

而 [Sass](https://sass-lang.com/) 是一个常用的 CSS 扩展语言，优点有不用打分号和大括号、支持嵌套选择器和便利的 At-Rules。但是 Sass 并不能直接被浏览器识别，需要转译到 CSS。这篇文章主要分享一下我在 esbuild 配 Sass 的过程中遇到的一些问题。

## 原理 { #principle }

esbuild 自己是有 CSS 打包器的，它会识别 `@import` 规则和 `url()` 中的路径，并在 `bundle: true` （开启打包）的前提下将 CSS 打包成单一文件。

Sass 转译器的作用其实只是将 Sass 转译到 CSS，然后再将转译后的 CSS 递给 esbuild，进行后续处理。这一点相当重要，因为后面提到的 [问题](#faq) 的根源有很多在此。

## esbuild 的 Sass 插件 { #sass-plugins-of-esbuild }

在有轮子的前提下当然是用别人造好的轮子了。支持在 esbuild 中引入 Sass 的、而且能用的社区插件有两个：[esbuild-plugin-sass](https://github.com/koluch/esbuild-plugin-sass/) 和 [esbuild-sass-plugin](https://github.com/glromeo/esbuild-sass-plugin/)。结论是在只转译 Sass 的前提下，两个插件的转译结果是一致的。速度上，单次构建时 esbuild-plugin-sass 的速度更快，而在热重载环境下（即配置了 `watch: true` 或者 `incremental: true` 情况下）esbuild-sass-plugin 的后续构建速度更快。

而 esbuild-sass-plugin 提供了更多的功能（如支持 PostCSS 和 `lit-css` 等），如果有这些需求，就只能选择 esbuild-sass-plugin 了。

## 常见问题 { #faq }

###### Q: 为什么有些 Sass 的配置项不起作用？

这里的“有些配置项”是指的 `outputStyle`, `indentType`, `indentWidth` 等用于调整输出格式的配置项。因为 Sass 转译器只是将 Sass 转译成 CSS，接下来 esbuild 会接着处理转译后的 CSS。所以即使在 Sass 中设置了一道输出格式，也会被上游的 esbuild 覆盖。

也就是说，真正起作用的是 esbuild 中的 `minify`。如果想实现 Sass 中 `outputStyle: compressed` 的效果，那么应该在 esbuild 中设置 `minify: true`。如果有其他设置输出格式的需求，需要直接对 esbuild 输出的结果进行二次处理。

###### Q: 如何处理 Sass 中引用的静态资源？

其实这个问题等价于“如何处理 CSS 中引用的静态资源”。