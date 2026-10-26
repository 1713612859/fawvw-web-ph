<script setup lang="ts">
// "More vehicles" grid (BYD Philippines style): the models not featured in the hero.
import { heroSlides } from '~/data/home'
import { models } from '~/data/models'

const featured = new Set(heroSlides.map((s) => s.model))
const more = models.filter((m) => !featured.has(m.slug))
</script>

<template>
  <section id="models" class="py-16 sm:py-24">
    <div class="container-x">
      <h2 class="h-section uppercase">More FAW-VW vehicles</h2>
      <p class="mt-3 text-[#444]">Volkswagen engineering, built by FAW-Volkswagen: efficient, safe and made to last.</p>

      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ModelCard v-for="m in more" :key="m.slug" :model="m" />
      </div>

      <div class="mt-10 flex justify-center">
        <NuxtLink to="/models" class="btn-primary">View all</NuxtLink>
      </div>
      <p class="mt-8 text-xs text-[#666]">
        *SRPs are subject to change without prior notice. Prices may vary by dealer and location. Provincial prices may be slightly higher due to transportation and logistics costs.
      </p>
    </div>
  </section>
</template>
