<script setup lang="ts">
import { formatDate } from '~/utils/format'
import { news } from '~/data/content'
import { findModel } from '~/data/models'

const route = useRoute()
const article = news.find((n) => n.slug === route.params.slug)
if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}
const model = findModel(article.model)
const more = news.filter((n) => n.slug !== article.slug)

useSeoMeta({
  title: article.title,
  description: article.excerpt,
  ogType: 'article',
  ogImage: model?.image,
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="`${article.category} · ${formatDate(article.date)}`"
      :title="article.title"
      :intro="article.excerpt"
      :crumbs="[{ label: 'News & Events', to: '/news' }, { label: article.category }]"
    />

    <article class="container-x py-12 sm:py-16">
      <div class="mx-auto max-w-3xl">
        <div v-if="model" class="aspect-[16/8] bg-gradient-to-br from-sky-100 via-slate-50 to-white px-8 py-6">
          <CarImage :src="model.image" :alt="model.name" :label="false" eager />
        </div>
        <div class="prose-page mt-10">
          <p v-for="(para, i) in article.body" :key="i" class="text-lg" :class="i === 0 && '!text-ink'">{{ para }}</p>
        </div>
        <div v-if="model" class="mt-12 flex flex-col items-start justify-between gap-4 bg-mist p-6 sm:flex-row sm:items-center">
          <div>
            <p class="text-sm text-slate-500">Featured in this story</p>
            <p class="font-display text-xl font-bold">{{ model.name }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="`/models/${model.slug}`" class="btn-outline">Explore</NuxtLink>
            <NuxtLink :to="`/test-drive?model=${model.slug}`" class="btn-primary">Book a test drive</NuxtLink>
          </div>
        </div>
      </div>
    </article>

    <section class="border-t border-slate-100 py-16">
      <div class="container-x">
        <h2 class="h-section">More stories</h2>
        <div class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <NewsCard v-for="(n, i) in more" :key="n.slug" :item="n" :index="i + 1" />
        </div>
      </div>
    </section>
  </div>
</template>
