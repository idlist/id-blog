import { throttle } from 'lodash-es'

const screenMiddle = 768

const dynamicLayout = (setLayout: () => void, clearLayout: () => void): void => {
  const throttleLayout = throttle(setLayout, 20)

  if (window.innerWidth > screenMiddle) {
    setLayout()
    window.addEventListener('scroll', throttleLayout)
  }

  window.addEventListener('resize', throttle(() => {
    window.removeEventListener('scroll', throttleLayout)

    if (window.innerWidth > screenMiddle) {
      setLayout()
      window.addEventListener('scroll', throttleLayout)
    } else {
      clearLayout()
    }
  }, 100))
}

export default dynamicLayout