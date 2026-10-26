<script setup lang="ts">
import { warranty } from '~/data/content'

useSeoMeta({
  title: 'Warranty',
  description: 'Warranty coverage for FAW-Volkswagen vehicles in the Philippines, including battery warranty and roadside assistance.',
})

const conditions = [
  'Scheduled maintenance is performed at an authorized FAW-VW service center.',
  'Genuine parts and recommended fluids are used.',
  'The vehicle is used for private, non-commercial purposes.',
  'Defects are reported promptly to an authorized service center.',
]
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Owners"
      title="Warranty"
      intro="Drive with confidence: every new FAW-Volkswagen comes with comprehensive factory warranty coverage."
      :crumbs="[{ label: 'Owners' }, { label: 'Warranty' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="w in warranty" :key="w.title" class="card p-7">
          <span class="grid size-12 place-items-center bg-brand-900/5 text-brand-700">
            <AppIcon :name="w.icon" class="size-6" />
          </span>
          <h2 class="mt-5 font-display text-lg font-bold">{{ w.title }}</h2>
          <p class="mt-1 font-semibold text-brand-700">{{ w.term }}</p>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ w.copy }}</p>
        </div>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <div class="card p-7 sm:p-8">
          <h2 class="font-display text-xl font-bold">Keeping your warranty valid</h2>
          <ul class="mt-5 space-y-3">
            <li v-for="c in conditions" :key="c" class="flex gap-3 text-slate-700">
              <AppIcon name="check" class="mt-0.5 size-5 shrink-0 text-brand-700" /> {{ c }}
            </li>
          </ul>
          <p class="mt-6 text-xs text-slate-400">Full coverage terms are stated in the warranty booklet provided with your vehicle.</p>
        </div>
        <div class="notch flex flex-col justify-between bg-carbon p-7 text-white sm:p-8">
          <div>
            <h2 class="font-display text-xl font-bold">Need warranty service?</h2>
            <p class="mt-3 text-white/70">Book an appointment at any authorized service center and mention your warranty concern. Our service advisor will take it from there.</p>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/owners/service" class="btn-light">Book a service</NuxtLink>
            <NuxtLink to="/owners/faq" class="btn-primary">Owner FAQ</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
