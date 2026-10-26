<script setup lang="ts">
import { type Category, categories, models } from '~/data/models'

useSeoMeta({
  title: 'All Models',
  description: 'Explore every FAW-Volkswagen sedan, SUV and electrified model available in the Philippines.',
})

const tabs: { key: Category | 'all'; label: string }[] = [{ key: 'all', label: 'All models' }, ...categories]
const tab = ref<Category | 'all'>('all')
const list = computed(() => (tab.value === 'all' ? models : models.filter((m) => m.category === tab.value)))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="The line-up"
      title="Find your Volkswagen"
      intro="Sedans, SUVs and electrified models, engineered to Volkswagen standards and built by FAW-Volkswagen."
      :crumbs="[{ label: 'Models' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter by body type" class="no-scrollbar flex overflow-x-auto border-b border-line">
          <button
            v-for="t in tabs"
            :key="t.key"
            type="button"
            role="tab"
            :aria-selected="tab === t.key"
            class="-mb-px whitespace-nowrap border-b-[3px] px-4 py-3 text-sm font-bold uppercase transition"
            :class="tab === t.key ? 'border-cta text-ink' : 'border-transparent text-[#777] hover:text-ink'"
            @click="tab = t.key"
          >
            {{ t.label }}
          </button>
        </div>
        <p class="text-sm text-slate-500">{{ list.length }} {{ list.length === 1 ? 'model' : 'models' }}</p>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ModelCard v-for="m in list" :key="m.slug" :model="m" />
      </div>

      <div class="mt-12 flex flex-col items-start justify-between gap-4 bg-mist p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 class="font-display text-xl font-bold">Not sure which one fits?</h2>
          <p class="mt-1 text-sm text-slate-500">Compare specs side by side, or check the latest prices for every variant.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/compare" class="btn-primary">Compare models</NuxtLink>
          <NuxtLink to="/price-list" class="btn-outline">Price list</NuxtLink>
        </div>
      </div>
      <p class="mt-6 text-xs text-slate-400">*Suggested retail prices. Prices may vary by dealer and location and are subject to change without prior notice.</p>
    </section>
  </div>
</template>
