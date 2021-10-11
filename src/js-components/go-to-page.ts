const GoButtons = document.querySelectorAll('.pagination-go')
const GoInputs = document.querySelectorAll('.pagination-input')
const GoLimits = document.querySelectorAll('.pagination-limit')

GoButtons.forEach((GoButton, i) => {
  GoButton.addEventListener('click', () => {
    const dest = parseInt((GoInputs[i] as HTMLInputElement).value)
    const length = parseInt((GoLimits[i] as HTMLElement).innerText)

    if (!isNaN(dest) && dest <= length) {
      location.href = `${location.origin}/p/${dest}`
    }
  })
})

export {}