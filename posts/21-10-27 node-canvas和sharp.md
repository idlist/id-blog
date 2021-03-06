---
title: 如何共同使用 node-canvas 和 sharp？
route: node-canvas-and-sharp
date: 2021-10-27
tags: programming nodejs
layout: article
---

[node-canvas](https://github.com/Automattic/node-canvas) 是目前在 Node.js 中不使用无头浏览器的前提下，生成带文字的图片的几乎唯一选择。而 [sharp](https://www.npmjs.com/package/sharp) 则是一个高效的图像处理库。两者的功能侧重不同，前者强于从零生成图像，而后者强于处理图像，所以经常会有开发者希望在同一个项目中同时使用这两个库，然后就遇到了这个问题：

`The specified procedure could not be found.`

然后，如果你因为标题而点开了这篇文章，那么，很遗憾，接下来是“听君一席话，如听一席话”时间：

在 **Windows** 下，你现在 **无法** 共同使用 node-canvas 和 sharp

## 为什么？

在 sharp 的 [文档](https://sharp.pixelplumbing.com/install#known-conflicts) 中注明了导致这一冲突的原因：node-canvas 在 Windows 上使用的预编译库使用的是上古版本的 GTK 2，它的上次更新还在 2011 年；而这和 sharp 使用的预编译库相冲突。node-canvas 的 issue [#930](https://github.com/Automattic/node-canvas/issues/930) 也追踪了这一点。

## 怎么办？

因为这个冲突只出现在 Windows 下，所以如果你的开发机使用的是非 Windows 系统，那么自然就不存在这个问题。但是现阶段，这个问题 **无法解决**，只能静待 node-canvas 的后续更新。

当然，也不是所有的人都等得起。比如，[skia-canvas](https://github.com/samizdatco/skia-canvas) 就是一个企图替代 node-canvas 的库，仓库建立于 2020 年，使用 [Skia](https://skia.org/) 而不是 node-canvas 使用的 [Cairo](https://www.cairographics.org/) 进行图像生成与处理，而且它不与 sharp 冲突。当然，另一方面，因为它更加新，所以可能遇到难以预测的问题。

不过，在一些新的 issue 中，node-canvas 的开发者也表示有考虑将图形库从 Cairo 换到 Skia，不过只是“考虑”，等到真的实装要到猴年马月去了，而且说不定就摸了。