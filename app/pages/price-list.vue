<script setup lang="ts">
import { modelDetails } from '~/data/modelDetails'
import { categories, formatPrice, models } from '~/data/models'

useSeoMeta({
  title: 'Price List',
  description: 'Latest suggested retail prices (SRP) for every FAW-Volkswagen model and variant in the Philippines.',
})

const groups = categories.map((c) => ({
  ...c,
  models: models.filter((m) => m.category === c.key).map((m) => ({ ...m, detail: modelDetails[m.slug]! })),
}))
const asOf = 'October 1, 2026'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Price List"
      :intro="`Suggested retail prices for every model and variant, valid as of ${asOf}.`"
      :crumbs="[{ label: 'Price List' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div v-for="g in groups" :key="g.key" class="mb-12 last:mb-0">
        <h2 class="font-display text-2xl font-bold">{{ g.label }}</h2>
        <div class="mt-5 space-y-4">
          <div v-for="m in g.models" :key="m.slug" class="card overflow-hidden">
            <div class="grid md:grid-cols-[260px_1fr]">
              <NuxtLink :to="`/models/${m.slug}`" class="flex flex-col justify-center gap-2 bg-gradient-to-b from-white to-slate-100 p-5">
                <span class="block aspect-[79/29]"><CarImage :src="m.image" :alt="m.name" :label="false" /></span>
                <span class="font-display text-lg font-bold text-ink">{{ m.name }}</span>
              </NuxtLink>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th class="px-5 py-3 font-semibold">Variant</th>
                      <th class="px-5 py-3 font-semibold">Powertrain</th>
                      <th class="px-5 py-3 text-right font-semibold">SRP</th>
                      <th class="px-5 py-3"><span class="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(v, i) in m.detail.variants" :key="v.name" class="border-b border-slate-50 last:border-0">
                      <td class="px-5 py-4 font-medium text-ink">{{ v.name }}</td>
                      <td class="px-5 py-4 text-slate-500">{{ m.detail.spec.powertrain }} · {{ m.detail.spec.transmission }}</td>
                      <td class="px-5 py-4 text-right font-semibold text-brand-900">{{ formatPrice(v.price) }}</td>
                      <td class="px-5 py-4 text-right">
                        <NuxtLink :to="`/get-a-quote?model=${m.slug}&variant=${i}`" class="whitespace-nowrap text-sm font-semibold text-brand-700 hover:text-brand-900">Get a quote →</NuxtLink>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-10 text-xs leading-relaxed text-slate-400">
        Prices are suggested retail prices (SRP) in Philippine pesos, inclusive of VAT, valid as of {{ asOf }}, and subject to change without prior notice.
        Prices may vary by dealer and location; provincial prices may be slightly higher due to logistics costs. Registration, insurance and accessories are not included.
      </p>
    </section>
  </div>
</template>
