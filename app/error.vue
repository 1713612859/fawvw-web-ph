<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: notFound.value ? 'Page not found' : 'Something went wrong' })

const shortcuts = [
  { label: 'All models', to: '/models' },
  { label: 'Get a Quote', to: '/get-a-quote' },
  { label: 'Book a Test Drive', to: '/test-drive' },
  { label: 'Find a Dealer', to: '/dealers' },
]
</script>

<template>
  <NuxtLayout>
    <section class="container-x py-20 text-center sm:py-28">
      <p class="font-display text-7xl font-extrabold text-brand-900/10 sm:text-8xl">{{ error.statusCode }}</p>
      <h1 class="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {{ notFound ? "We can't find that page" : 'Something went wrong' }}
      </h1>
      <p class="mx-auto mt-4 max-w-md text-slate-500">
        {{ notFound ? 'The page may have moved, or the link may be mistyped. Try one of these instead:' : 'Please try again in a moment, or head back to the home page.' }}
      </p>
      <div class="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-3">
        <button type="button" class="btn-primary" @click="clearError({ redirect: '/' })">Back to home</button>
        <button v-for="s in shortcuts" :key="s.to" type="button" class="btn-outline" @click="clearError({ redirect: s.to })">{{ s.label }}</button>
      </div>
    </section>
  </NuxtLayout>
</template>
