<script setup lang="ts">
import { computed, ref } from 'vue'
import { clamp } from 'lodash-es'
import type { LangCode } from '@/i18n'
import { defaultLang } from '@/utils/client'

const props = defineProps<{
  view: string
  code: LangCode
  last: number
}>()

const { view, code, last } = props
const to = ref<string>('')
const toParsed = computed(() => parseInt(to.value))

const toPage = (e: MouseEvent) => {
  e.preventDefault()

  if (to.value === '') {
    return
  }

  let page = clamp(toParsed.value, 1, last)
  const root = code === defaultLang ? '/' : `/${code}/`

  let dest: string
  if (view === 'posts') {
    dest = page === 1 ? '' : `${view}/${page}`
  } else {
    dest = page === 1 ? view : `${view}/${page}`
  }

  location.href = `${location.origin}${root}${dest}`
}
</script>

<template>
  <div class="pagination-go">
    <input type="text" class="pagination-go__input" v-model="to" @keyup="to = to.replace(/[^\d]/g, '')" />
    <div>/</div>
    <div>{{ last }}</div>
    <a class="pagination-go__text" @click="toPage" href="/">GO</a>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/utils' as *;
@use '@/styles/mixin' as mixin;

.pagination-go {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.5rem;
  user-select: none;
}

.pagination-go__input {
  border: none;
  border-bottom: 1px solid var(--color-black);

  width: 2rem;

  text-align: center;
  line-height: 1.5;
}

.pagination-go__text {
  @include mixin.btn-pagination;

  @include override {
    font-size: 0.875rem;
  }
}
</style>
