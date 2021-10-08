import dynamicLayout from './dynamic-layout'

const TOC = document.querySelector('.article-toc') as HTMLElement

const setTocHeight = () => {
  const height = Math.max(window.innerHeight - 12 * 16, 48)
  TOC.style.maxHeight = `${height}px`
}

const clearTocHeight = () => {
  TOC.style.maxHeight = ''
}

dynamicLayout(setTocHeight, clearTocHeight)