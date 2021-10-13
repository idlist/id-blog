import dynamicLayout from './dynamic-layout'

const Sidebar = document.querySelector('.article-sidebar') as HTMLElement
const Me = document.querySelector('.article-me') as HTMLElement

const offsetLimit = 16 * 6

let state = false

const addSticky = () => {
  const elWidth = Sidebar.clientWidth
  const elRight = document.body.offsetWidth - Sidebar.offsetLeft - Sidebar.offsetWidth

  state = true
  Me.classList.add('hidden')
  Sidebar.classList.add('sticky')
  Sidebar.style.width = `${elWidth}px`
  Sidebar.style.right = `${elRight}px`
}

const removeSticky = () => {
  state = false
  Me.classList.remove('hidden')
  Sidebar.classList.remove('sticky')
  Sidebar.style.width = ''
  Sidebar.style.right = ''
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