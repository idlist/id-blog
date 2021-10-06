const menu = document.querySelector('.menu-expander') as HTMLLinkElement
const menuButton = document.querySelector('.menu-button') as HTMLImageElement
const menuDropdown = document.querySelector('.menu-fullscreen') as HTMLElement

const dir = {
  public: 'public'
}

menu.addEventListener('click', () => {
  menuDropdown.classList.toggle('hidden')
  const state = menuDropdown.classList.contains('hidden')
  menuButton.setAttribute('src', state ? `/${dir.public}/buttons/menu.svg` : `/${dir.public}/buttons/close.svg`)
})

export {}