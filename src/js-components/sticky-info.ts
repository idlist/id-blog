import { throttle } from 'lodash-es'

const Information = document.querySelector('.article-information') as HTMLElement
const offsetLimit = 16 * 2

let state = false

const toggleSticker = () => {
  const offset = document.documentElement.scrollTop

  if (!state && offset > offsetLimit) {
    const elWidth = Information.clientWidth
    const elRight = document.body.offsetWidth - Information.offsetLeft - Information.offsetWidth

    state = true
    Information.classList.add('sticky')
    Information.style.width = `${elWidth}px`
    Information.style.right = `${elRight}px`
  } else if (state && offset < offsetLimit || document.body.offsetWidth < 640) {
    state = false
    Information.classList.remove('sticky')
    Information.style.width = ''
    Information.style.right = ''
  }
}

window.addEventListener('scroll', throttle(() => {
  toggleSticker()
}, 50))

window.addEventListener('resize', throttle(() => {
  state = true
  toggleSticker()
  toggleSticker()
}, 100))
