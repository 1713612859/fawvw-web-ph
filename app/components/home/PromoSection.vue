<script setup lang="ts">
import { promos } from '~/data/home'
import { promoPhotos } from '~/data/media'
</script>

<template>
  <section class="border-t border-line bg-white py-16 sm:py-24">
    <div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 class="h-section uppercase">Promos &amp; offers</h2>
          <p class="mt-3 text-[#444]">Make your next Volkswagen easier to own.</p>
        </div>
        <NuxtLink to="/promos" class="btn-dark btn-sm">View all</NuxtLink>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <NuxtLink v-for="p in promos" :key="p.slug" :to="`/promos#${p.slug}`" class="group flex flex-col border border-line bg-white">
          <div class="notch relative aspect-[16/10] overflow-hidden">
            <img :src="promoPhotos[p.slug]" alt="" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
            <span class="tag-dark absolute left-4 top-4">{{ p.tag }}</span>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <h3 class="font-display text-2xl font-bold">{{ p.title }}</h3>
            <p class="mt-2 text-[15px] leading-relaxed text-[#555]">{{ p.copy }}</p>
            <p class="mt-3 text-xs uppercase text-[#888]">{{ p.models }}</p>
            <span class="link-cta mt-auto pt-5">Learn more <AppIcon name="arrow-right" class="size-4 transition group-hover:translate-x-1" /></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
