<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, triggerRef, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Random from 'inaba'
import { shuffle, range } from 'lodash-es'
import { weightedTile, tilePool } from './tiles'
import TileBig from './tile-big.vue'
import TileSmall from './tile-small.vue'
import { ones } from '@/utils/client'

const size = 192
const offsetX = -Random.int(size)
const offsetY = -Random.int(size)

const { width, height } = useWindowSize()
const column = computed(() => Math.floor(width.value / size) + 2)
const row = computed(() => Math.floor(height.value / size) + 2)

const enum TileSize {
  Big = 0,
  Small = 1,
}

interface TileTypeBig {
  type: TileSize.Big
  variant: string
  rotate: number
}

interface TileTypeSmall {
  type: TileSize.Small
  variants: string[]
  rotates: number[]
}

type TileType = TileTypeBig | TileTypeSmall

const tileMap = shallowRef<TileType[][]>([])

const getTileBig = (): TileTypeBig => ({
  type: 0,
  variant: Random.pick(tilePool),
  rotate: Random.pick(range(4)) * 90,
})

const getTileSmall = (): TileTypeSmall => ({
  type: 1,
  variants: shuffle([
    Random.pick(Object.keys(weightedTile.rect)),
    Random.pick(Object.keys(weightedTile.triangle)),
    Random.pick(Object.keys(weightedTile.circle)),
    Random.pick(Object.keys(weightedTile.diamond)),
  ]),
  rotates: shuffle(range(4)).map((d) => d * 90),
})

const minInterval = 2
const maxInterval = 4
let counter = 0
let tillNext = Random.int(0, maxInterval)

const isTileSmall = (tile?: TileType) => {
  return tile && tile.type === TileSize.Small
}

const getTile = (j: number, i: number): TileType => {
  const tileAbove = tileMap.value[j - 1]?.[i]
  const tileBelow = tileMap.value[j + 1]?.[i]
  const tileLeft = tileMap.value[j]?.[i - 1]

  if (isTileSmall(tileAbove) || isTileSmall(tileBelow) || isTileSmall(tileLeft)) {
    return getTileBig()
  } else if (counter === tillNext) {
    tillNext = Random.int(minInterval, maxInterval)
    counter = 0
    return getTileSmall()
  } else {
    counter++
    return getTileBig()
  }
}

watch([column, row], () => {
  const prevRow = tileMap.value.length

  if (prevRow < row.value) {
    const increase = row.value - prevRow
    tileMap.value.push(...ones<TileType[]>(increase, []))
  }
  if (prevRow > row.value) {
    tileMap.value.splice(row.value)
  }

  for (let j = 0; j < row.value; j++) {
    const prevColumn = tileMap.value[j]?.length ?? 0

    if (prevColumn < column.value) {
      for (let i = prevColumn; i < column.value; i++) {
        tileMap.value[j].push(getTile(j, i))
      }
    }
    if (prevColumn > column.value) {
      tileMap.value[j].splice(column.value)
    }
  }

  triggerRef(tileMap)
}, { immediate: true })

const loaded = ref(false)

onMounted(() => {
  loaded.value = true
})
</script>

<template>
  <div class="tile-wall">
    <Transition name="tile-wall">
      <svg :width="width" :height="height" v-show="loaded">
        <template v-for="(row, j) of tileMap" :key="j">
          <template v-for="(each, i) of row" :key="i">
            <TileBig
              v-if="each.type === TileSize.Big"
              :type="each.variant"
              :x="size * i + offsetX"
              :y="size * j + offsetY"
              :size="size"
              :rotate="each.rotate" />
            <TileSmall
              v-else
              :types="each.variants"
              :x="size * i + offsetX"
              :y="size * j + offsetY"
              :size="size"
              :rotates="each.rotates" />
          </template>
        </template>
      </svg>
    </Transition>
  </div>
</template>

<style lang="sass">
.tile-wall
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: -10

  background-color: var(--color-background)

.tile-wall-enter-active,
.tile-wall-leave-active
  transition: opacity 0.25s ease

.tile-wall-enter-from,
.tile-wall-leave-to
  opacity: 0
</style>
