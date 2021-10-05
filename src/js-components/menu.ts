const menu = document.querySelector('.menu-expander') as HTMLLinkElement
const menuDropdown = document.querySelector('.menu-dropdown') as HTMLElement

menu.addEventListener('click', () => {
  menuDropdown.classList.toggle('hidden')
})

export {}