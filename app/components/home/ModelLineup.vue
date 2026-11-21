<script setup lang="ts">
// Line-up cards under the hero: the home page models (new-energy only), in line-up order.
// The full line-up is on /models.
import { homeModels } from '~/data/home'
</script>

<template>
  <section id="models" class="py-16 sm:py-24">
    <div class="container-x">
      <h2 class="h-section uppercase">New-energy vehicles</h2>
      <p class="mt-3 text-[#444]">Electric and plug-in hybrid JOYEE and BESTUNE models from China FAW.</p>

      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ModelCard v-for="m in homeModels" :key="m.slug" :model="m" />
      </div>

      <div class="mt-10 flex justify-center">
        <NuxtLink to="/models" class="btn-primary">View all models</NuxtLink>
      </div>
    </div>
  </section>
</template>
