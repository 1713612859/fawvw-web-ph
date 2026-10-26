<script setup lang="ts">
// Standard top band for inner pages (dark, BYD Philippines style).
defineProps<{
  title: string
  eyebrow?: string
  intro?: string
  crumbs?: { label: string; to?: string }[]
}>()
</script>

<template>
  <section class="bg-carbon text-white">
    <div class="container-x py-12 sm:py-16">
      <nav v-if="crumbs?.length" aria-label="Breadcrumb" class="mb-5 flex flex-wrap items-center gap-1.5 text-xs uppercase text-white/50">
        <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
        <template v-for="c in crumbs" :key="c.label">
          <AppIcon name="chevron-right" class="size-3.5" />
          <NuxtLink v-if="c.to" :to="c.to" class="hover:text-white">{{ c.label }}</NuxtLink>
          <span v-else class="text-white/80">{{ c.label }}</span>
        </template>
      </nav>
      <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[0.16em] text-accent">{{ eyebrow }}</p>
      <h1 class="mt-2 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-[3.25rem]">{{ title }}</h1>
      <p v-if="intro" class="mt-4 max-w-2xl leading-relaxed text-white/70">{{ intro }}</p>
      <slot />
    </div>
  </section>
</template>
