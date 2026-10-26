<script setup lang="ts">
import { media } from '~/data/media'

useSeoMeta({
  title: 'German Engineering, Built by FAW-Volkswagen',
  description: 'Explore FAW-Volkswagen sedans, SUVs and electrified models in the Philippines. Get a quote, book a test drive and find your nearest dealer.',
  ogTitle: 'FAW-VW Philippines',
  ogDescription: 'Explore the FAW-Volkswagen line-up in the Philippines.',
  ogType: 'website',
})
</script>

<template>
  <div>
    <HomeHeroCarousel />
    <HomeModelLineup />
    <HomeBrandSection />
    <HomePromoSection />
    <HomeNewsSection />
    <CtaTiles :photo="media.tayron?.hero?.src" />
  </div>
</template>
