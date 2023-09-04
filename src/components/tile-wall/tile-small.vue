<script setup lang="ts">
import { computed } from 'vue'
import { range } from 'lodash-es'
import { tiles } from './tiles'

const props = defineProps<{
  types: string[]
  x: number
  y: number
  size: number
  rotates: number[]
}>()

const r = computed(() => props.size / 2)
</script>

<template>
  <template v-for="j of range(2)">
    <template v-for="i of range(2)">
      <svg :x="x + r * i" :y="y + r * j" :width="r" :height="r">
        <g :transform="`rotate(${rotates[j * 2 + i]}, ${r / 2}, ${r / 2})`">
          <image :href="tiles[types[j * 2 + i]].src" :width="r" :height="r" />
        </g>
      </svg>
    </template>
  </template>
</template>
