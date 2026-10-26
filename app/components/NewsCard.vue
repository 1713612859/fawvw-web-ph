<script setup lang="ts">
// Blog / news card (BYD Philippines style) using the featured model's official photo.
import { formatDate } from '~/utils/format'
import type { NewsItem } from '~/data/content'
import { media } from '~/data/media'
import { findModel } from '~/data/models'

const props = defineProps<{ item: NewsItem; index?: number }>()

const model = computed(() => findModel(props.item.model))
const cover = computed(() => {
  const m = media[props.item.model]
  return m?.hero ?? m?.gallery[0]
})
</script>

<template>
  <NuxtLink :to="`/news/${item.slug}`" class="group flex flex-col">
    <div class="notch relative aspect-[16/10] overflow-hidden bg-[#e9e9e9]">
      <img v-if="cover" :src="cover.src" :alt="cover.alt" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
      <div v-else-if="model" class="absolute inset-x-[6%] bottom-[8%] top-[22%]"><CarImage :src="model.image" :alt="model.name" :label="false" /></div>
    </div>
    <p class="mt-5 text-xs font-bold uppercase text-cta">{{ item.category }}</p>
    <h3 class="mt-2 font-display text-xl font-bold leading-snug text-ink transition group-hover:text-cta">{{ item.title }}</h3>
    <p class="mt-2 text-sm text-[#666]">FAW-VW Philippines · {{ formatDate(item.date) }}</p>
    <span class="link-cta mt-4">Continue reading <AppIcon name="arrow-right" class="size-4 transition group-hover:translate-x-1" /></span>
  </NuxtLink>
</template>
