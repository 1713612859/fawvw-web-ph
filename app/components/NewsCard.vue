<script setup lang="ts">
// News card: the story's own cover photo, or the featured model's photo.
import { formatDate } from '~/utils/format'
import { newsCover, type NewsItem } from '~/data/content'

const props = defineProps<{ item: NewsItem; index?: number }>()

const cover = computed(() => newsCover(props.item))
</script>

<template>
  <NuxtLink :to="`/news/${item.slug}`" class="group flex flex-col">
    <div class="notch relative aspect-[16/10] overflow-hidden bg-[#e9e9e9]">
      <img :src="cover.src" :alt="cover.alt" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
    </div>
    <p class="mt-5 text-xs font-bold uppercase text-cta">{{ item.category }}</p>
    <h3 class="mt-2 font-display text-xl font-bold leading-snug text-ink transition group-hover:text-cta">{{ item.title }}</h3>
    <p class="mt-2 text-sm text-[#666]">FAWCAR · {{ formatDate(item.date) }}</p>
    <span class="link-cta mt-4">Continue reading <AppIcon name="arrow-right" class="size-4 transition group-hover:translate-x-1" /></span>
  </NuxtLink>
</template>
