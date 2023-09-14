<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { range, sum } from 'lodash-es'
import { tiles } from './tiles'
import { ones } from '@/utils/client'

const props = defineProps<{
  types: string[]
  x: number
  y: number
  size: number
  rotates: number[]
}>()

const emit = defineEmits<{
  load: []
}>()

const n = (i: number, j: number) => j * 2 + i
const r = computed(() => props.size / 2)

const images = ref<SVGImageElement[] | null>(null)
const loaded = ref(0)

watch(loaded, (next, prev) => {
  if (next != prev && next == 4) {
    emit('load')
  }
})

onMounted(() => {
  for (const image of images.value!) {
    image.addEventListener('load', () => {
      loaded.value += 1
    }, { once: true })
  }
})
</script>

<template>
  <template v-for="j of range(2)">
    <template v-for="i of range(2)">
      <svg :x="x + r * i" :y="y + r * j" :width="r" :height="r">
        <g :transform="`rotate(${rotates[n(i, j)]}, ${r / 2}, ${r / 2})`">
          <image ref="images" :href="tiles[types[n(i, j)]].src" :width="r" :height="r" />
        </g>
      </svg>
    </template>
  </template>
</template>
