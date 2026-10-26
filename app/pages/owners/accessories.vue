<script setup lang="ts">
import { accessories } from '~/data/content'

useSeoMeta({
  title: 'Genuine Accessories',
  description: 'Personalize and protect your Volkswagen with genuine accessories, fitted by authorized dealers.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Owners"
      title="Genuine Accessories"
      intro="Designed for your Volkswagen, tested to the same standards, and fitted by our technicians."
      :crumbs="[{ label: 'Owners' }, { label: 'Genuine Accessories' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="a in accessories" :key="a.title" class="card p-7">
          <span class="grid size-12 place-items-center bg-brand-900/5 text-brand-700">
            <AppIcon :name="a.icon" class="size-6" />
          </span>
          <h2 class="mt-5 font-display text-lg font-bold">{{ a.title }}</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="item in a.items" :key="item" class="flex gap-2.5 text-sm text-slate-600">
              <AppIcon name="check" class="mt-0.5 size-4 shrink-0 text-brand-700" /> {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 grid gap-6 bg-mist p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 class="font-display text-2xl font-bold">Why genuine?</h2>
          <p class="mt-2 max-w-2xl text-slate-600">
            Genuine accessories fit perfectly, keep your vehicle warranty intact and come with a one-year parts warranty when installed by an authorized dealer.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn-primary">Ask for a price</NuxtLink>
          <NuxtLink to="/dealers" class="btn-outline">Find a dealer</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
