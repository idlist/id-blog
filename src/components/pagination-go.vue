<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LangCode } from '@/i18n'
import { clamp } from '@/utils/client'

const props = defineProps<{
  view: string
  code: LangCode
  last: number
}>()

const { view, code, last } = props
const to = ref<string>('')
const toParsed = computed(() => parseInt(to.value))

const toPage = () => {
  if (to.value === '') {
    return
  }

  let page = clamp(toParsed.value, 1, last)
  const root = code === 'zh' ? '/' : `/${code}/`

  let dest: string
  if (view === 'posts') {
    dest = page === 1 ? '' : `${view}/${page}`
  } else {
    dest = page === 1 ? view : `${view}/${page}`
  }

  console.log(`${location.origin}${root}${dest}`)
  location.href = `${location.origin}${root}${dest}`
}
</script>

<template>
  <div class="pagination-go">
    <input
      type="text"
      class="pagination-go__input"
      v-model.trim="to"
      @keyup="to = to.replace(/[^\d]/g, '')" />
    <div>/</div>
    <div>{{ last }}</div>
    <a class="pagination-go__text" @click="toPage">GO</a>
  </div>
</template>

<style lang="sass" scoped>
@use '@/styles/mixins' as mixins

.pagination-go
  display: flex
  align-items: center
  justify-content: center
  column-gap: 0.5rem
  user-select: none

.pagination-go__input
  border: none
  border-bottom: 1px solid var(--color-black)

  width: 2rem

  text-align: center
  line-height: 1.5

.pagination-go__text
  @include mixins.btn-pagination

  font-size: 0.875rem
</style>