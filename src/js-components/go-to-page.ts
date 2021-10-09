const GoButton = document.querySelector('.pagination-go') as HTMLLinkElement
const GoInput = document.querySelector('.pagination-input') as HTMLInputElement
const GoLimit = document.querySelector('.pagination-limit') as HTMLElement

GoButton.addEventListener('click', () => {
  const dest = parseInt(GoInput.value)
  const length = parseInt(GoLimit.innerText)

  if (!isNaN(dest) && dest <= length) {
    location.href = `${location.origin}/p/${dest}`
  }
})

export {}