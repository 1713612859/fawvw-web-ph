<script setup lang="ts">
// Dark call-to-action band in the BYD Philippines style: a large photo card for
// "Compare Models" plus four white tiles.
import type { IconName } from '~/utils/icons'

const props = defineProps<{ model?: string; photo?: string }>()

const q = (base: string, key = 'model') => (props.model ? `${base}?${key}=${props.model}` : base)
const tiles = computed<{ icon: IconName; title: string; copy: string; to: string }[]>(() => [
  { icon: 'pin', title: 'Find a Dealer', copy: 'Find an FAW-VW showroom near you.', to: '/dealers' },
  { icon: 'calculator', title: 'Financing Calculator', copy: 'Estimate your down payment and monthly amortization.', to: q('/financing') },
  { icon: 'quote', title: 'Get a Quote', copy: 'Fast, customized price quotes from our nationwide dealer network.', to: q('/get-a-quote') },
  { icon: 'steering', title: 'Take a Test Drive', copy: 'Schedule a test drive for your desired Volkswagen at your convenience.', to: q('/test-drive') },
])
</script>

<template>
  <section class="bg-carbon py-16 sm:py-20">
    <div class="container-x grid gap-4 lg:grid-cols-2">
      <NuxtLink :to="q('/compare', 'models')" class="notch group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden p-7 text-white sm:min-h-[372px]">
        <img v-if="photo" :src="photo" alt="" loading="lazy" class="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div v-else class="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_40%,#2b2f36,#121212_70%)]" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />
        <AppIcon name="steering" class="size-8" />
        <p class="mt-3 font-display text-4xl font-bold">Compare Models</p>
        <p class="mt-1 text-white/80">Find the Volkswagen that best suits you.</p>
        <AppIcon name="arrow-right" class="absolute bottom-7 right-7 size-7 -rotate-45 transition group-hover:rotate-0" />
      </NuxtLink>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink v-for="t in tiles" :key="t.title" :to="t.to" class="notch group relative flex min-h-[178px] flex-col bg-white p-6 text-ink transition hover:bg-[#f2f2f2]">
          <AppIcon :name="t.icon" class="size-8" />
          <p class="mt-4 font-display text-xl font-bold">{{ t.title }}</p>
          <p class="mt-1 pr-10 text-sm leading-relaxed text-[#555]">{{ t.copy }}</p>
          <AppIcon name="arrow-right" class="absolute bottom-6 right-6 size-6 -rotate-45 transition group-hover:rotate-0" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
