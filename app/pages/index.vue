<script setup lang="ts">
// The header sits transparent over the full-screen hero (see SiteHeader).
definePageMeta({ headerOverlay: true })

useSeoMeta({
  title: 'JOYEE and BESTUNE Cars from China FAW',
  description: 'Explore FAWCAR electric, hybrid and gasoline cars in the Philippines: JOYEE N09, S08, S04 and the BESTUNE line-up. Get a quote, book a test drive and find your nearest dealer.',
  ogTitle: 'FAWCAR Philippines',
  ogDescription: 'Explore the JOYEE and BESTUNE line-up from China FAW in the Philippines.',
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
    <HomeLeadForm />
  </div>
</template>
