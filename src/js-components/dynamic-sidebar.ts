import dynamicLayout from './dynamic-layout'

const Hoverer = document.querySelector('.article-hover') as HTMLElement

const setHovererHeight = () => {
  const height = window.innerHeight - 16 * 4.5
  Hoverer.style.maxHeight = `${height}px`

  if (Hoverer.scrollHeight > height) {
    Hoverer.style.paddingRight = '0.5rem'
  }
}

const clearHovererHeight = () => {
  Hoverer.style.maxHeight = ''
  Hoverer.style.paddingRight = ''
}

dynamicLayout(setHovererHeight, clearHovererHeight)