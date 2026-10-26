<script setup lang="ts">
import { faqs } from '~/data/content'

useSeoMeta({
  title: 'Owner FAQ',
  description: 'Answers to common questions about maintenance, warranty, charging and financing.',
})

const open = ref<number | null>(0)
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Owners"
      title="Owner FAQ"
      intro="Quick answers about maintenance, warranty, charging and more."
      :crumbs="[{ label: 'Owners' }, { label: 'Owner FAQ' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="mx-auto max-w-3xl divide-y divide-slate-100 border border-slate-100">
        <div v-for="(f, i) in faqs" :key="f.q">
          <h2>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink hover:text-brand-700"
              :aria-expanded="open === i"
              :aria-controls="`faq-${i}`"
              @click="open = open === i ? null : i"
            >
              {{ f.q }}
              <AppIcon name="chevron-down" class="size-5 shrink-0 transition-transform" :class="open === i && 'rotate-180'" />
            </button>
          </h2>
          <div v-show="open === i" :id="`faq-${i}`" class="px-6 pb-6 leading-relaxed text-slate-600">{{ f.a }}</div>
        </div>
      </div>

      <div class="mx-auto mt-10 flex max-w-3xl flex-col items-start justify-between gap-4 bg-mist p-6 sm:flex-row sm:items-center">
        <p class="font-semibold">Still have a question?</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn-primary">Contact us</NuxtLink>
          <NuxtLink to="/owners/service" class="btn-outline">Book a service</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
