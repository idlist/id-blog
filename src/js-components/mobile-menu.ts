const Menu = document.querySelector('.menu-expander') as HTMLLinkElement
const MenuButton = document.querySelector('.menu-button') as HTMLImageElement
const MenuDropdown = document.querySelector('.menu-fullscreen') as HTMLElement

const dir = {
  public: 'public'
}

Menu.addEventListener('click', () => {
  MenuDropdown.classList.toggle('hidden')
  const state = MenuDropdown.classList.contains('hidden')
  MenuButton.setAttribute('src', state ? `/${dir.public}/buttons/menu.svg` : `/${dir.public}/buttons/close.svg`)
})

export {}