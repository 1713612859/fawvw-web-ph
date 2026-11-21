<script setup lang="ts">
// Company facts from fawcar.com (About FAWCAR), summarized in our own words.
import { media } from '~/data/media'
import type { IconName } from '~/utils/icons'

useSeoMeta({
  title: 'About Us',
  description: 'FAWCAR Philippines brings the JOYEE and BESTUNE cars of FAW Car, part of China FAW Group, to Filipino drivers.',
})

// FAWCAR's technology programs, as named on fawcar.com.
const technology: { icon: IconName; title: string; copy: string }[] = [
  { icon: 'award', title: 'Yueying Platform', copy: 'The vehicle architecture behind the new JOYEE and BESTUNE models.' },
  { icon: 'leaf', title: 'Zhuri HyperDrive', copy: 'Electrified powertrains: BMP pure electric, hybrid and range-extended drive.' },
  { icon: 'cpu', title: 'Ruyi Smart Cabin', copy: 'The in-car system behind the large touchscreens, voice control and connected features.' },
  { icon: 'steering', title: 'Lingji Pilot', copy: 'Driver assistance, from adaptive cruise control to automatic parking.' },
]

const promises: { icon: IconName; title: string; copy: string }[] = [
  { icon: 'tag', title: 'Sales', copy: 'Authorized FAWCAR dealers with quotes, test drives and financing help for every model.' },
  { icon: 'wrench', title: 'Service', copy: 'Trained technicians and genuine parts. After-sales details per dealer are to be confirmed.' },
  { icon: 'shield', title: 'Peace of mind', copy: 'Warranty and roadside assistance terms for the Philippines are to be confirmed.' },
]

const storyPhotos = [
  media['joyee-s04']!.hero,
  media['joyee-n09']!.gallery[3]!,
  media['joyee-s08']!.hero,
  media['bestune-t90']!.gallery[4]!,
]
</script>

<template>
  <div>
    <PageHeader
      eyebrow="About us"
      title="JOYEE and BESTUNE, from China FAW."
      intro="FAWCAR Philippines brings the new-energy JOYEE and the BESTUNE line-up of FAW Car to Filipino drivers."
      :crumbs="[{ label: 'About Us' }]"
    />

    <section class="py-16 sm:py-20">
      <div class="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p class="eyebrow">Our story</p>
          <h2 class="h-section mt-3">A user-centric carmaker.</h2>
          <div class="prose-page">
            <p>
              FAW Car Co., Ltd. is part of China FAW Group and has been listed since 1997. Its own passenger car brand was
              founded in 2006 and today spans JOYEE, for electric, plug-in hybrid and range-extended cars, and BESTUNE.
            </p>
            <p>
              Design and R&amp;D teams in Changchun, Shenyang, Shanghai and Munich develop the cars, and every model goes
              through a full-process quality system from development to delivery. FAWCAR now sells in more than 40 countries.
            </p>
            <p>
              In October 2026 the JOYEE S04, S08 and N09 launched in Manila, with authorized dealers in Metro Manila,
              Pampanga and Bulacan.
            </p>
          </div>
          <a href="https://www.fawcar.com/info" target="_blank" rel="noopener" class="link-cta mt-6">
            More on fawcar.com <AppIcon name="arrow-right" class="size-4" />
          </a>
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
        <p class="eyebrow">Technology</p>
        <h2 class="h-section mt-3">Built on four technology programs.</h2>
        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="t in technology" :key="t.title" class="card p-7">
            <span class="grid size-12 place-items-center bg-brand-900/5 text-brand-700">
              <AppIcon :name="t.icon" class="size-6" />
            </span>
            <h3 class="mt-5 font-display text-lg font-bold">{{ t.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ t.copy }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-mist py-16 sm:py-20">
      <div class="container-x">
        <p class="eyebrow">Our promise</p>
        <h2 class="h-section mt-3">With you from showroom to service bay.</h2>
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <div v-for="p in promises" :key="p.title" class="card bg-white p-7">
            <span class="grid size-12 place-items-center bg-brand-900/5 text-brand-700">
              <AppIcon :name="p.icon" class="size-6" />
            </span>
            <h3 class="mt-5 font-display text-lg font-bold">{{ p.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ p.copy }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaTiles :photo="media['bestune-m9']!.hero.src" />
  </div>
</template>
