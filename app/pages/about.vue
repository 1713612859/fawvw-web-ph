<script setup lang="ts">
import { media } from '~/data/media'
import type { IconName } from '~/utils/icons'

useSeoMeta({
  title: 'About Us',
  description: 'FAW-Volkswagen in the Philippines: German engineering, built with craftsmanship and backed by a nationwide dealer network.',
})

const promises: { icon: IconName; title: string; copy: string }[] = [
  { icon: 'steering', title: 'Sales', copy: 'Product specialists who know every model, transparent pricing and financing options from partner banks.' },
  { icon: 'wrench', title: 'Service', copy: 'Factory-trained technicians, genuine parts and service centers in Metro Manila, Luzon, Visayas and Mindanao.' },
  { icon: 'shield', title: 'Peace of mind', copy: 'Comprehensive warranty, 24/7 roadside assistance and a dedicated customer care team.' },
]
// Four official lifestyle photos for the story section.
const storyPhotos = ['talagon', 'magotan', 'tayron', 'id-aura-t6'].map((s) => media[s]?.hero).filter((p) => !!p)
</script>

<template>
  <div>
    <PageHeader
      eyebrow="About us"
      title="German engineering, now on Philippine roads."
      intro="FAW-VW Philippines brings the FAW-Volkswagen line-up to Filipino drivers, with sales, service and parts support nationwide."
      :crumbs="[{ label: 'About Us' }]"
    />

    <section class="py-16 sm:py-20">
      <div class="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p class="eyebrow">Our story</p>
          <h2 class="h-section mt-3">Three decades of building quality cars.</h2>
          <div class="prose-page">
            <p>
              FAW-Volkswagen was founded in 1991 in Changchun as a joint venture between FAW Group and Volkswagen AG. Since then it has grown to five production bases and built cars for more than 30 million owners.
            </p>
            <p>
              Every vehicle is engineered to Volkswagen's global standards and produced on highly automated lines, then tested rigorously before it leaves the plant.
            </p>
            <p>
              In the Philippines, we bring that heritage to a nationwide network of showrooms and service centers, with models chosen for the way Filipinos drive: through city traffic, across expressways and up mountain roads.
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(ph, i) in storyPhotos" :key="ph.src" class="aspect-[4/3] overflow-hidden" :class="i === 1 && 'notch'">
            <img :src="ph.src" :alt="ph.alt" loading="lazy" class="h-full w-full object-cover">
          </div>
        </div>
      </div>
    </section>

    <HomeBrandSection />

    <section class="py-16 sm:py-20">
      <div class="container-x">
        <p class="eyebrow">Our promise</p>
        <h2 class="h-section mt-3">With you from showroom to service bay.</h2>
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <div v-for="p in promises" :key="p.title" class="card p-7">
            <span class="grid size-12 place-items-center bg-brand-900/5 text-brand-700">
              <AppIcon :name="p.icon" class="size-6" />
            </span>
            <h3 class="mt-5 font-display text-lg font-bold">{{ p.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ p.copy }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaTiles :photo="media.sagitar?.hero?.src" />
  </div>
</template>
