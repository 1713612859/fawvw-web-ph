<script setup lang="ts">
import { news } from '~/data/content'

useSeoMeta({
  title: 'News & Events',
  description: 'Latest news, events and stories from FAW-VW Philippines.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Newsroom"
      title="News & Events"
      intro="Launches, events and stories from the road."
      :crumbs="[{ label: 'News & Events' }]"
    />
    <section class="container-x py-12 sm:py-16">
      <div class="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        <NewsCard v-for="(n, i) in news" :key="n.slug" :item="n" :index="i" />
      </div>
    </section>
  </div>
</template>
