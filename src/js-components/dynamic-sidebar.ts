import dynamicLayout from './dynamic-layout'

const Sidebar = document.querySelector('.article-sidebar') as HTMLElement

const setSidebarHeight = () => {
  const height = window.innerHeight - 16 * 4.5
  Sidebar.style.maxHeight = `${height}px`

  if (Sidebar.scrollHeight > height) {
    Sidebar.style.paddingRight = '0.5rem'
  }
}

const clearSidebarHeight = () => {
  Sidebar.style.maxHeight = ''
  Sidebar.style.paddingRight = ''
}

dynamicLayout(setSidebarHeight, clearSidebarHeight)