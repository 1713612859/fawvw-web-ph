<script setup lang="ts">
import { formatSpec, modelDetails, specRows } from '~/data/modelDetails'
import { findModel, formatPrice, models } from '~/data/models'

useSeoMeta({
  title: 'Compare Models',
  description: 'Compare FAW-Volkswagen models side by side: price, dimensions, powertrain and features.',
})

const route = useRoute()
const picks = ref<string[]>(['talagon', 'tayron', 'magotan'])

// Prefill from /compare?models=a,b (after mount so prerendered HTML matches).
onMounted(() => {
  const q = String(route.query.models ?? '').split(',').filter((s) => findModel(s))
  if (q.length) {
    const rest = picks.value.filter((p) => !q.includes(p))
    picks.value = [...q, ...rest].slice(0, 3)
  }
})

const columns = computed(() => picks.value.map((slug) => ({ model: findModel(slug)!, detail: modelDetails[slug]! })))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Compare Models"
      intro="Pick up to three models to compare price, size, powertrain and features side by side."
      :crumbs="[{ label: 'Compare Models' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] table-fixed text-sm">
          <colgroup>
            <col class="w-[22%]">
            <col v-for="i in 3" :key="i">
          </colgroup>
          <thead>
            <tr>
              <th class="p-3 text-left align-bottom">
                <span class="font-display text-lg font-bold">Choose models</span>
              </th>
              <th v-for="(c, i) in columns" :key="i" class="p-3 align-top">
                <label class="sr-only" :for="`cmp-${i}`">Model {{ i + 1 }}</label>
                <select :id="`cmp-${i}`" v-model="picks[i]" class="field-input text-left">
                  <option v-for="m in models" :key="m.slug" :value="m.slug" :disabled="picks.includes(m.slug) && picks[i] !== m.slug">{{ m.name }}</option>
                </select>
                <div class="mt-4 aspect-[79/29] bg-gradient-to-b from-white to-slate-100 px-2">
                  <CarImage :src="c.model.image" :alt="c.model.name" :label="false" />
                </div>
                <p class="mt-3 font-display text-lg font-bold text-ink">{{ c.model.name }}</p>
                <p class="text-xs font-normal text-slate-500">{{ c.model.tagline }}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-mist">
              <th class="px-4 py-3 text-left font-semibold" scope="row">Starts at</th>
              <td v-for="(c, i) in columns" :key="i" class="px-4 py-3 text-center text-base font-bold text-brand-900" >
                {{ formatPrice(c.model.priceFrom) }}
              </td>
            </tr>
            <template v-for="g in specRows" :key="g.group">
              <tr>
                <th :colspan="4" class="px-4 pb-2 pt-8 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" scope="colgroup">{{ g.group }}</th>
              </tr>
              <tr v-for="r in g.rows" :key="r.key" class="border-b border-slate-100">
                <th class="px-4 py-3 text-left font-medium text-slate-500" scope="row">{{ r.label }}</th>
                <td v-for="(c, i) in columns" :key="i" class="px-4 py-3 text-center text-ink">{{ formatSpec(c.detail.spec, r.key, r.unit) }}</td>
              </tr>
            </template>
            <tr>
              <td />
              <td v-for="(c, i) in columns" :key="i" class="px-3 pt-8 text-center">
                <div class="flex flex-col gap-2">
                  <NuxtLink :to="`/models/${c.model.slug}`" class="btn-outline !py-2.5">View {{ c.model.name }}</NuxtLink>
                  <NuxtLink :to="`/get-a-quote?model=${c.model.slug}`" class="btn-primary !py-2.5">Get a Quote</NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-8 text-xs text-slate-400">Specifications shown are for the base variant and may change without prior notice. Prices are suggested retail prices.</p>
    </section>
  </div>
</template>
