import dynamicLayout from './dynamic-layout'

const Information = document.querySelector('.article-information') as HTMLElement
const Me = document.querySelector('.article-me') as HTMLElement

const offsetLimit = 16 * 6

let state = false

const addSticky = () => {
  const elWidth = Information.clientWidth
  const elRight = document.body.offsetWidth - Information.offsetLeft - Information.offsetWidth

  state = true
  Me.classList.add('hidden')
  Information.classList.add('sticky')
  Information.style.width = `${elWidth}px`
  Information.style.right = `${elRight}px`
}

const removeSticky = () => {
  state = false
  Me.classList.remove('hidden')
  Information.classList.remove('sticky')
  Information.style.width = ''
  Information.style.right = ''
}

const toggleSticky = () => {
  const offset = document.documentElement.scrollTop

  if (!state && offset >= offsetLimit) {
    addSticky()
  } else if (state && offset < offsetLimit) {
    removeSticky()
  }
}

dynamicLayout(toggleSticky, removeSticky)