<script setup lang="ts">
import { type Category, categories, isCategory, models } from '~/data/models'

useSeoMeta({
  title: 'All Models',
  description: 'Explore the FAWCAR line-up of JOYEE and BESTUNE sedans, SUVs, MPV and city cars: electric, hybrid and gasoline.',
})

const tabs: { key: Category | 'all'; label: string }[] = [{ key: 'all', label: 'All models' }, ...categories]
const tab = ref<Category | 'all'>('all')

// /models?category=suv opens that tab (menu and footer links). Read after mount so the
// prerendered page (all models) hydrates cleanly, and again when the menu changes the query.
const route = useRoute()
const fromQuery = () => {
  const c = route.query.category
  tab.value = isCategory(c) ? c : 'all'
}
onMounted(fromQuery)
watch(() => route.query.category, fromQuery)
const list = computed(() => (tab.value === 'all' ? models : models.filter((m) => m.category === tab.value)))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="The line-up"
      title="Find your FAWCAR"
      intro="JOYEE new-energy models and BESTUNE cars from China FAW: sedans, SUVs, an MPV and city cars, electric, hybrid and gasoline."
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
          <p class="mt-1 text-sm text-slate-500">Compare specs side by side, or ask a dealer for prices and availability.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/compare" class="btn-primary">Compare models</NuxtLink>
          <NuxtLink to="/get-a-quote" class="btn-outline">Get a quote</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
