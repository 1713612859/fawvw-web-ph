<script setup lang="ts">
import { companyName, legalLinks, site } from '~/data/site'

defineProps<{
  title: string
  intro: string
  updated: string
  sections: { heading: string; paras?: string[]; list?: string[] }[]
}>()
</script>

<template>
  <div>
    <PageHeader eyebrow="Legal" :title="title" :intro="intro" :crumbs="[{ label: title }]" />
    <section class="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[220px_1fr]">
      <nav class="lg:sticky lg:top-24 lg:self-start" aria-label="Legal pages">
        <ul class="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          <li v-for="l in legalLinks" :key="l.to">
            <NuxtLink
              :to="l.to"
              class="block px-4 py-2.5 text-sm font-medium transition"
              active-class="bg-brand-900 text-white"
              :class="$route.path === l.to ? '' : 'text-slate-600 hover:bg-mist'"
            >{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="prose-page max-w-3xl">
        <p class="!mt-0 text-sm text-slate-400">Last updated: {{ updated }}</p>
        <template v-for="s in sections" :key="s.heading">
          <h2>{{ s.heading }}</h2>
          <p v-for="(p, i) in s.paras" :key="i">{{ p }}</p>
          <ul v-if="s.list">
            <li v-for="item in s.list" :key="item">{{ item }}</li>
          </ul>
        </template>
        <h2>Contact</h2>
        <p>
          {{ companyName }} · {{ site.address }} · {{ site.hotline }} ·
          <a :href="`mailto:${site.email}`" class="font-medium text-brand-700 underline underline-offset-2">{{ site.email }}</a>
        </p>
      </div>
    </section>
  </div>
</template>
