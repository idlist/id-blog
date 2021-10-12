const GoButtons = document.querySelectorAll('.pagination-go')
const GoInputs = document.querySelectorAll('.pagination-input')
const GoLimits = document.querySelectorAll('.pagination-limit')

GoButtons.forEach((GoButton, i) => {
  GoButton.addEventListener('click', () => {
    const destPage = parseInt((GoInputs[i] as HTMLInputElement).value)
    const length = parseInt((GoLimits[i] as HTMLElement).innerText)

    if (!isNaN(destPage) && destPage <= length) {
      let dest = ''
      const path = location.pathname
      const tokens = path.split('/')

      console.log(tokens)

      if (['', 'p'].includes(tokens[1])) dest = `p/${destPage}`
      if (['tags', 'tl'].includes(tokens[1])) dest = `${tokens[1]}/${tokens[2]}/${destPage}`

      if (tokens[1] == 'e' || tokens[1] == 'a') {
        if (tokens[2] == 'p' || tokens.length == 2) dest = `${tokens[1]}/p/${destPage}`
        if (['tags', 'tl'].includes(tokens[2])) dest = `${tokens[1]}/${tokens[2]}/${tokens[3]}/${destPage}`
      }

      location.href = `${location.origin}/${dest}`
    }
  })
})

export {}