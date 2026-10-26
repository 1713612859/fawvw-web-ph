<script setup lang="ts">
import { news } from '~/data/home'
</script>

<template>
  <section class="border-t border-line bg-white py-16 sm:py-24">
    <div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="eyebrow">The FAW-VW blog</p>
          <h2 class="h-section mt-3">Recent stories</h2>
        </div>
        <NuxtLink to="/news" class="btn-dark btn-sm">View all</NuxtLink>
      </div>

      <div class="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-3">
        <NewsCard v-for="(n, i) in news" :key="n.slug" :item="n" :index="i" />
      </div>
    </div>
  </section>
</template>
