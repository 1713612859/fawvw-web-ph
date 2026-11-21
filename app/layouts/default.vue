<script setup lang="ts">
// Pages with definePageMeta({ headerOverlay: true }) start under the (transparent) header.
const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1" :class="route.meta.headerOverlay === true && '-mt-16 lg:-mt-20'">
      <slot />
    </main>
    <SiteFooter />
    <FloatingContact />
    <CookieBanner />
  </div>
</template>
