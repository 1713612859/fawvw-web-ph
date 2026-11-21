<script setup lang="ts">
// Vehicle card in the BYD Philippines style (no prices: quotes come from the dealers).
import { type CarModel, powertrainLabel } from '~/data/models'

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
      <p class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cta">
        {{ model.brand }}
        <span v-if="model.launchedPH" class="bg-cta px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-white">New in PH</span>
      </p>
      <h3 class="mt-1 text-xl font-medium text-ink">{{ model.name }}</h3>
      <p class="text-[15px] text-[#777]">{{ model.body }} · {{ powertrainLabel(model) }}</p>
      <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div v-for="s in model.keySpecs.slice(0, 2)" :key="s.label">
          <dt class="text-xs text-[#777]">{{ s.label }}</dt>
          <dd class="text-sm font-bold text-ink">{{ s.value }}</dd>
        </div>
      </dl>
      <div class="mt-auto pt-5">
        <NuxtLink :to="`/models/${model.slug}`" class="btn-primary btn-sm w-full">View vehicle</NuxtLink>
        <NuxtLink :to="`/get-a-quote?model=${model.slug}`" class="mt-2 flex h-9 items-center justify-center text-sm font-bold uppercase text-ink transition hover:text-cta">Get a quote</NuxtLink>
      </div>
    </div>
  </article>
</template>
