import m from 'mithril'

import { shuffle } from 'lodash-es'
import { pick, randInt, range, randBag, fillArray } from '../js-components/utils.js'

const tiles = {
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
    circle_1: 1
  },
  diamond: {
    diamond_1: 2
  }
}

const allTiles: Record<string, number> = {}
let tilePool: string[] = []

for (const variants of Object.values(tiles)) {
  for (const [variant, weight] of Object.entries(variants)) {
    allTiles[variant] = weight
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
      return m('image', {
        x: x,
        y: y,
        width: size,
        height: size,
        href: `/public/tiles/${pick(tilePool)}.svg`,
        transform: `rotate(${rotate}, ${x + size / 2}, ${y + size / 2})`,
        alt: 'tile'
      })
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
  const localTiles = shuffle([
    pick(Object.keys(tiles.rect)),
    pick(Object.keys(tiles.triangle)),
    pick(Object.keys(tiles.circle)),
    pick(Object.keys(tiles.diamond))
  ])

  return {
    view({ attrs: { size, x, y } }) {
      return range(2).map(column =>
        range(2).map(row => {
          const i = column * 2 + row
          const psize = size / 2
          const px = x + psize * row
          const py = y + psize * column

          return m('image', {
            x: px,
            y: py,
            width: psize,
            height: psize,
            href: `/public/tiles/${localTiles[i]}.svg`,
            transform: `rotate(${rotate[i]}, ${px + psize / 2}, ${py + psize / 2})`,
            alt: 'tile'
          })
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