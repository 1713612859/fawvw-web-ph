<script setup lang="ts">
// Brand proof block (BYD "Global No.1" style) + financing banner card with an official photo.
import { brandStats } from '~/data/home'
import { media } from '~/data/media'

const bannerPhoto = media['bestune-t90']!.gallery[1]!.src
</script>

<template>
  <section class="pb-16 sm:pb-24">
    <div class="container-x">
      <div class="mx-auto max-w-3xl text-center">
        <p class="eyebrow">Backed by China FAW</p>
        <h2 class="h-section mt-3 uppercase">Happy travel for all</h2>
        <p class="mt-5 leading-relaxed text-[#444]">
          FAWCAR builds the JOYEE and BESTUNE cars of China FAW, with styling and R&amp;D centers from Changchun to Munich
          and a sales network in more than 40 countries. Now the line-up arrives in the Philippines.
        </p>
        <NuxtLink to="/about" class="btn-primary mt-8">Learn more</NuxtLink>
      </div>

      <dl class="mx-auto mt-12 grid max-w-4xl grid-cols-2 border-y border-line md:grid-cols-4">
        <div v-for="(s, i) in brandStats" :key="s.label" class="px-4 py-6 text-center" :class="i > 0 && 'md:border-l md:border-line'">
          <dd class="font-display text-4xl font-bold">{{ s.value }}</dd>
          <dt class="mt-1 text-sm text-[#666]">{{ s.label }}</dt>
        </div>
      </dl>

      <NuxtLink to="/financing" class="notch group relative isolate mt-16 flex min-h-[340px] flex-col justify-center overflow-hidden p-8 text-white sm:min-h-[420px] sm:p-12">
        <img v-if="bannerPhoto" :src="bannerPhoto" alt="" loading="lazy" class="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/40 to-transparent" aria-hidden="true" />
        <span class="tag-dark w-fit">Financing Calculator</span>
        <p class="mt-4 max-w-md font-display text-[2.4rem] font-bold leading-[1.05] sm:text-[3.25rem]">Plan your FAWCAR purchase.</p>
        <p class="mt-3 max-w-md text-white/85">Enter the price from your dealer quote to estimate the down payment and monthly amortization.</p>
        <span class="btn-primary mt-7 w-fit">Calculate now</span>
      </NuxtLink>
    </div>
  </section>
</template>
