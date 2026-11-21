<script setup lang="ts">
// One cell of a specification sheet: spec-sheet symbols get a text alternative,
// multi-line values keep their line breaks.
const props = defineProps<{ value: string }>()

const symbol = computed(() => {
  const v = props.value.trim()
  if (v === '●') return { mark: '●', text: 'Standard' }
  if (v === '○' || v === '⚪') return { mark: '○', text: 'Optional' }
  if (v === '-' || v === '–') return { mark: '–', text: 'Not available' }
  return undefined
})
</script>

<template>
  <span v-if="symbol" :class="symbol.text === 'Not available' ? 'text-slate-400' : 'font-bold'">
    <span aria-hidden="true">{{ symbol.mark }}</span><span class="sr-only">{{ symbol.text }}</span>
  </span>
  <span v-else class="whitespace-pre-line">{{ value }}</span>
</template>
