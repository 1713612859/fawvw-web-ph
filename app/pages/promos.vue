<script setup lang="ts">
import { formatDate } from '~/utils/format'
import { promos } from '~/data/home'
import { promoPhotos } from '~/data/media'

useSeoMeta({
  title: 'Promos & Offers',
  description: 'Current FAW-VW Philippines promos: low down payment financing, free PMS packages and trade-in bonuses.',
})

</script>

<template>
  <div>
    <PageHeader
      eyebrow="Offers & programs"
      title="Promos & Offers"
      intro="Make your next Volkswagen easier to own with these limited-time programs, available at participating dealers nationwide."
      :crumbs="[{ label: 'Promos & Offers' }]"
    />

    <section class="container-x space-y-6 py-12 sm:py-16">
      <article
        v-for="(p, i) in promos"
        :id="p.slug"
        :key="p.slug"
        class="card grid scroll-mt-28 overflow-hidden md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div class="relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden p-8 text-white">
          <img :src="promoPhotos[p.slug]" alt="" loading="lazy" class="absolute inset-0 -z-20 h-full w-full object-cover">
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
          <span class="tag-dark w-fit">{{ p.tag }}</span>
          <h2 class="mt-4 font-display text-3xl font-bold">{{ p.title }}</h2>
          <p class="mt-2 max-w-sm text-white/85">{{ p.copy }}</p>
        </div>
        <div class="flex flex-col p-8">
          <ul class="space-y-3">
            <li v-for="d in p.details" :key="d" class="flex gap-3 text-slate-700">
              <AppIcon name="check" class="mt-0.5 size-5 shrink-0 text-brand-700" /> {{ d }}
            </li>
          </ul>
          <dl class="mt-6 grid grid-cols-2 gap-4 bg-mist p-4 text-sm">
            <div>
              <dt class="text-slate-500">Eligible models</dt>
              <dd class="mt-0.5 font-semibold text-ink">{{ p.models }}</dd>
            </div>
            <div>
              <dt class="text-slate-500">Valid until</dt>
              <dd class="mt-0.5 font-semibold text-ink">{{ formatDate(p.validUntil) }}</dd>
            </div>
          </dl>
          <div class="mt-auto flex flex-wrap gap-3 pt-8">
            <NuxtLink to="/get-a-quote" class="btn-primary">Avail this offer</NuxtLink>
            <NuxtLink to="/dealers" class="btn-outline">Find a dealer</NuxtLink>
          </div>
        </div>
      </article>

      <p class="text-xs leading-relaxed text-slate-400">
        Promos are subject to terms and conditions, availability and bank approval where applicable, and cannot be combined unless stated.
        Ask your dealer for full mechanics.
      </p>
    </section>
  </div>
</template>
