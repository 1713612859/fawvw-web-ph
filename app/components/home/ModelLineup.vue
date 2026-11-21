<script setup lang="ts">
// Line-up cards under the hero: every model, in line-up order.
import { models } from '~/data/models'
</script>

<template>
  <section id="models" class="py-16 sm:py-24">
    <div class="container-x">
      <h2 class="h-section uppercase">The FAWCAR line-up</h2>
      <p class="mt-3 text-[#444]">JOYEE new-energy models and BESTUNE cars from China FAW: electric, hybrid and gasoline.</p>

      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ModelCard v-for="m in models" :key="m.slug" :model="m" />
      </div>

      <div class="mt-10 flex justify-center">
        <NuxtLink to="/models" class="btn-primary">View all models</NuxtLink>
      </div>
    </div>
  </section>
</template>
