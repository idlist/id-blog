<script setup lang="ts">
import { computed } from 'vue'
import { tiles } from './tiles'

const props = defineProps<{
  type: string
  x: number
  y: number
  size: number
  rotate: number
}>()

const r = computed(() => props.size / 2)
</script>

<template>
  <svg :x="x" :y="y" :width="size" :height="size">
    <g :transform="`rotate(${rotate}, ${r}, ${r})`">
      <image :href="tiles[type].src" :width="size" :height="size" />
    </g>
  </svg>
</template>
