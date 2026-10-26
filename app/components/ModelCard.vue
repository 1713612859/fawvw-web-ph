<script setup lang="ts">
// Vehicle card in the BYD Philippines style.
import { type CarModel, formatPrice } from '~/data/models'

defineProps<{ model: CarModel }>()
</script>

<template>
  <article class="group flex h-full flex-col border border-line bg-white">
    <NuxtLink :to="`/models/${model.slug}`" class="relative block aspect-[16/10] bg-white" :aria-label="`View ${model.name}`" tabindex="-1">
      <div class="absolute inset-x-4 bottom-2 top-4 transition-transform duration-500 group-hover:scale-[1.04]">
        <CarImage :src="model.image" :alt="model.name" />
      </div>
    </NuxtLink>
    <div class="flex flex-1 flex-col px-5 pb-6 pt-2 sm:px-6">
      <h3 class="text-xl font-medium text-ink">{{ model.name }}</h3>
      <p class="text-[15px] text-[#777]">{{ model.badges[0] }}</p>
      <p class="mt-3 text-sm font-bold text-ink">{{ model.keySpecs[0]?.value }} · {{ model.keySpecs[1]?.value }}</p>
      <p class="mt-2 text-[15px] text-ink">Starts at <span class="ml-1">{{ formatPrice(model.priceFrom) }}</span></p>
      <div class="mt-auto pt-5">
        <NuxtLink :to="`/models/${model.slug}`" class="btn-primary btn-sm w-full">View vehicle</NuxtLink>
        <NuxtLink :to="`/get-a-quote?model=${model.slug}`" class="mt-2 flex h-9 items-center justify-center text-sm font-bold uppercase text-ink transition hover:text-cta">Get a quote</NuxtLink>
      </div>
    </div>
  </article>
</template>
