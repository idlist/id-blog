<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { tiles } from './tiles'

const props = defineProps<{
  type: string
  x: number
  y: number
  size: number
  rotate: number
}>()

const emit = defineEmits<{
  load: []
}>()

const r = computed(() => props.size / 2)

const image = ref<SVGImageElement | null>(null)

onMounted(() => {
  image.value?.addEventListener('load', () => {
    emit('load')
  }, { once: true })
})
</script>

<template>
  <svg :x="x" :y="y" :width="size" :height="size">
    <g :transform="`rotate(${rotate}, ${r}, ${r})`">
      <image ref="image" :href="tiles[type].src" :width="size" :height="size" />
    </g>
  </svg>
</template>
