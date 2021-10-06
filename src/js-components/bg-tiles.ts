import m from 'mithril'

import { shuffle, throttle } from 'lodash-es'
import { pick, randInt, range, randBag, fillArray } from './utils.js'

import rect_1 from '../assets/tiles/rect_1.svg'
import rect_2 from '../assets/tiles/rect_2.svg'
import rect_3 from '../assets/tiles/rect_3.svg'
import rect_4 from '../assets/tiles/rect_4.svg'
import rect_5 from '../assets/tiles/rect_5.svg'

import triangle_1 from '../assets/tiles/triangle_1.svg'
import triangle_2 from '../assets/tiles/triangle_2.svg'
import triangle_3 from '../assets/tiles/triangle_3.svg'

import circle_1 from '../assets/tiles/circle_1.svg'
import circle_2 from '../assets/tiles/circle_2.svg'
import circle_3 from '../assets/tiles/circle_3.svg'

import diamond_1 from '../assets/tiles/diamond_1.svg'

const tiles: Record<string, string> = {
  rect_1,
  rect_2,
  rect_3,
  rect_4,
  rect_5,
  triangle_1,
  triangle_2,
  triangle_3,
  circle_1,
  circle_2,
  circle_3,
  diamond_1
}

const tileType = {
  rect: {
    rect_1: 4,
    rect_2: 4,
    rect_3: 2,
    rect_4: 1,
    rect_5: 1
  },
  triangle: {
    triangle_1: 4,
    triangle_2: 2,
    triangle_3: 1
  },
  circle: {
    circle_1: 1,
    circle_2: 2,
    circle_3: 2
  },
  diamond: {
    diamond_1: 2
  }
}

let tilePool: string[] = []

for (const variants of Object.values(tileType)) {
  for (const [variant, weight] of Object.entries(variants)) {
    tilePool = tilePool.concat(fillArray(weight, variant))
  }
}

interface BigPileAttrs {
  size: number,
  x: number,
  y: number,
  rotate: number
}

const BigTile: m.ClosureComponent<BigPileAttrs> = () => {
  return {
    view({ attrs: { size, x, y, rotate } }) {
      return m('svg', {
        x: x,
        y: y,
        width: size,
        height: size
      }, [
        m('g', {
          transform: `rotate(${rotate}, ${size / 2}, ${size / 2})`
        }, [
          m.trust(tiles[pick(tilePool)])
        ])
      ])
    }
  }
}

interface SmallPilesAttrs {
  size: number,
  x: number,
  y: number
}

const SmallTiles: m.ClosureComponent<SmallPilesAttrs> = () => {
  const rotate = randBag(4).map(d => d * 90)
  const selectedTiles = shuffle([
    pick(Object.keys(tileType.rect)),
    pick(Object.keys(tileType.triangle)),
    pick(Object.keys(tileType.circle)),
    pick(Object.keys(tileType.diamond))
  ])

  return {
    view({ attrs: { size, x, y } }) {
      return range(2).map(column =>
        range(2).map(row => {
          const i = column * 2 + row
          const psize = size / 2
          const px = x + psize * row
          const py = y + psize * column

          return m('svg', {
            x: px,
            y: py,
            width: psize,
            height: psize
          }, [
            m('g', {
              transform: `rotate(${rotate[i]}, ${psize / 2}, ${psize / 2})`
            }, [
              m.trust(tiles[selectedTiles[i]])
            ])
          ])
        })
      )
    }
  }
}

const BackgroundTiles: m.ClosureComponent = () => {
  const size = 192
  const offsetX = -randInt(size), offsetY = -randInt(size)
  let width = 0, height = 0
  let columns: number[] = [], rows: number[] = []

  const calcTileDimensions = (): void => {
    width = window.innerWidth
    height = window.innerHeight
    columns = range(width / size + 2)
    rows = range(height / size + 2)
  }

  const minInterval = 2, maxInterval = 5
  let count = 0, nextTile = randInt(0, maxInterval)
  let nextTileDefined = false
  const tileRecord: boolean[] = []

  /**
   * Decide whether to generate small tiles or a big tile
   * @returns `true` for small tiles, `false` for big tile
   */
  const generateTileType = (): boolean => {
    const i = tileRecord.length
    let tile = false

    if (nextTileDefined) {
      nextTileDefined = false
      tile = true
      count = 0
      nextTile = randInt(minInterval, maxInterval)
    } else if (count == nextTile) {
      if (i >= columns.length && tileRecord[i - columns.length]) {
        nextTileDefined = true
      } else {
        tile = true
        count = 0
        nextTile = randInt(minInterval, maxInterval)
      }
    } else {
      count++
    }

    tileRecord.push(tile)
    return tile
  }

  const rotateRecord: number[] = []

  const generateRotation = (): number => {
    const i = rotateRecord.length
    const tileLeft = (i > 1 && i != columns.length) ? rotateRecord[i - 1] : -1
    const tileTop = i >= columns.length ? tileRecord[i - columns.length] : -1

    const rotate = pick(range(4).filter(d => d != tileLeft || d != tileTop))
    rotateRecord.push(rotate)

    return rotate * 90
  }

  window.addEventListener('resize', throttle(() => { m.redraw() }, 1000))

  return {
    view() {
      calcTileDimensions()

      return m('svg', { width, height },
        rows.map(row =>
          columns.map(column =>
            generateTileType()
              ? m(SmallTiles, {
                size: size,
                x: size * column + offsetX,
                y: size * row + offsetY
              })
              : m(BigTile, {
                size: size,
                x: size * column + offsetX,
                y: size * row + offsetY,
                rotate: generateRotation()
              })
          )
        )
      )
    }
  }
}

m.mount(document.getElementById('bg-tiles') as HTMLElement, BackgroundTiles)