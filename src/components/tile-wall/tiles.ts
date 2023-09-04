import { ones } from '@/utils/client'
import type { ImageMetadata as ImageMeta } from 'astro'

import rect_1 from '@/assets/tiles/rect_1.svg'
import rect_2 from '@/assets/tiles/rect_2.svg'
import rect_3 from '@/assets/tiles/rect_3.svg'
import rect_4 from '@/assets/tiles/rect_4.svg'
import rect_5 from '@/assets/tiles/rect_5.svg'

import triangle_1 from '@/assets/tiles/triangle_1.svg'
import triangle_2 from '@/assets/tiles/triangle_2.svg'
import triangle_3 from '@/assets/tiles/triangle_3.svg'

import circle_1 from '@/assets/tiles/circle_1.svg'
import circle_2 from '@/assets/tiles/circle_2.svg'
import circle_3 from '@/assets/tiles/circle_3.svg'

import diamond_1 from '@/assets/tiles/diamond_1.svg'

export const tiles: Record<string, ImageMeta> = {
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
  diamond_1,
}

export const weightedTile = {
  rect: {
    rect_1: 4,
    rect_2: 4,
    rect_3: 2,
    rect_4: 1,
    rect_5: 1,
  },
  triangle: {
    triangle_1: 4,
    triangle_2: 2,
    triangle_3: 1,
  },
  circle: {
    circle_1: 1,
    circle_2: 2,
    circle_3: 2,
  },
  diamond: {
    diamond_1: 2,
  },
}

const tilePool: string[] = []

for (const variants of Object.values(weightedTile)) {
  for (const [variant, weight] of Object.entries(variants)) {
    tilePool.push(...ones(weight, variant))
  }
}

export { tilePool }