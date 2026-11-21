<script setup lang="ts">
// Side-by-side comparison of up to three models on the rows every spec sheet has
// (specs.ts `compareRows`). Where variants differ, the range across variants is shown.
import { findModel, models, powertrainLabel } from '~/data/models'
import { compareRows, compareValue } from '~/data/specs'

useSeoMeta({
  title: 'Compare Models',
  description: 'Compare FAWCAR models side by side: powertrain, range, size and equipment.',
})

const route = useRoute()
const picks = ref<string[]>(['joyee-s04', 'joyee-s08', 'bestune-t90'])

// Prefill from /compare?models=a,b (after mount so prerendered HTML matches).
onMounted(() => {
  const q = String(route.query.models ?? '').split(',').filter((s) => findModel(s))
  if (q.length) {
    const rest = picks.value.filter((p) => !q.includes(p))
    picks.value = [...q, ...rest].slice(0, 3)
  }
})

const columns = computed(() => picks.value.map((slug) => findModel(slug)!))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Compare Models"
      intro="Pick up to three models to compare powertrain, size and equipment side by side."
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
              <th v-for="(m, i) in columns" :key="i" class="p-3 align-top">
                <label class="sr-only" :for="`cmp-${i}`">Model {{ i + 1 }}</label>
                <select :id="`cmp-${i}`" v-model="picks[i]" class="field-input text-left">
                  <option v-for="o in models" :key="o.slug" :value="o.slug" :disabled="picks.includes(o.slug) && picks[i] !== o.slug">{{ o.name }}</option>
                </select>
                <div class="mt-4 aspect-[2/1] bg-gradient-to-b from-white to-slate-100 px-2">
                  <CarImage :src="m.image" :alt="m.name" :label="false" />
                </div>
                <p class="mt-3 font-display text-lg font-bold text-ink">{{ m.name }}</p>
                <p class="text-xs font-normal text-slate-500">{{ m.body }} · {{ powertrainLabel(m) }}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="g in compareRows" :key="g.group">
              <tr>
                <th :colspan="4" class="px-4 pb-2 pt-8 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" scope="colgroup">{{ g.group }}</th>
              </tr>
              <tr v-for="r in g.rows" :key="r.label" class="border-b border-slate-100">
                <th class="px-4 py-3 text-left font-medium text-slate-500" scope="row">{{ r.label }}</th>
                <td v-for="(m, i) in columns" :key="i" class="px-4 py-3 text-center text-ink">{{ compareValue(m.slug, r) }}</td>
              </tr>
            </template>
            <tr>
              <td />
              <td v-for="(m, i) in columns" :key="i" class="px-3 pt-8 text-center">
                <div class="flex flex-col gap-2">
                  <NuxtLink :to="`/models/${m.slug}#specs`" class="btn-outline !py-2.5">Full specs</NuxtLink>
                  <NuxtLink :to="`/get-a-quote?model=${m.slug}`" class="btn-primary !py-2.5">Get a Quote</NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-8 text-xs text-slate-400">
        From the manufacturer's specification sheets on fawcar.com. A range (for example 118–160 kW) covers the variants of a model; electric range and fuel use are CLTC / WLTC test values. Philippine specifications may differ.
      </p>
    </section>
  </div>
</template>
