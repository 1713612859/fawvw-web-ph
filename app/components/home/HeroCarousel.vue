<script setup lang="ts">
// Home hero in the BYD Philippines style: full-bleed official photo, centred tags/title/buttons,
// and model tabs along the bottom. Autoplays; pauses on hover.
import { heroSlides } from '~/data/home'
import { media } from '~/data/media'
import { findModel } from '~/data/models'

const slides = heroSlides.map((s) => {
  const model = findModel(s.model)!
  return { ...s, model, photo: media[model.slug]?.hero }
})
const INTERVAL = 6500

const current = ref(0)
const progress = ref(0)
// Photos are loaded on demand: the visible slide first, the next one shortly before it shows.
const PRELOAD_AT = 0.6
const loaded = reactive(new Set<number>([0]))
function want(i: number) {
  loaded.add((i + slides.length) % slides.length)
}
const hovering = ref(false)
const autoplay = ref(true)

let raf = 0
let last = 0
function loop(t: number) {
  if (last && autoplay.value && !hovering.value) {
    // Real elapsed time (capped at 1 s so a backgrounded tab doesn't skip slides),
    // so slides advance every INTERVAL even when the device renders few frames.
    progress.value += Math.min(t - last, 1000) / INTERVAL
    if (progress.value >= PRELOAD_AT) want(current.value + 1)
    if (progress.value >= 1) {
      progress.value = 0
      current.value = (current.value + 1) % slides.length
    }
  }
  last = t
  raf = requestAnimationFrame(loop)
}

function go(i: number) {
  current.value = (i + slides.length) % slides.length
  progress.value = 0
}
watch(current, (c) => want(c))

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay.value = false
  raf = requestAnimationFrame(loop)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

let touchX = 0
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX
  if (Math.abs(dx) > 50) go(current.value + (dx < 0 ? 1 : -1))
}
</script>

<template>
  <section
    class="relative isolate h-[min(calc(100svh-6.5rem),760px)] min-h-[600px] overflow-hidden bg-carbon text-white"
    aria-roledescription="carousel"
    aria-label="Featured models"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div
      v-for="(s, i) in slides"
      :key="s.model.slug"
      class="absolute inset-0 transition-opacity duration-700"
      :class="i === current ? 'opacity-100' : 'pointer-events-none opacity-0'"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} of ${slides.length}: ${s.model.name}`"
      :aria-hidden="i !== current"
    >
      <template v-if="s.photo">
        <img
          v-if="loaded.has(i)"
          :src="s.photo.src"
          :alt="s.photo.alt"
          :fetchpriority="i === 0 ? 'high' : 'low'"
          decoding="async"
          class="absolute inset-0 -z-20 h-full w-full object-cover"
        >
      </template>
      <div v-else class="absolute inset-0 -z-20 flex items-end justify-center bg-[radial-gradient(ellipse_at_50%_60%,#2b2f36,#121212_70%)] pb-[16%]">
        <div class="aspect-[79/29] w-[70%] max-w-3xl"><CarImage :src="s.model.image" :alt="s.model.name" /></div>
      </div>
      <div class="absolute inset-0 -z-10 bg-black/45" aria-hidden="true" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />

      <div
        class="container-x flex h-full flex-col items-center justify-center pb-24 text-center transition duration-700"
        :class="i === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
      >
        <div class="flex flex-wrap justify-center gap-2">
          <span class="tag">{{ s.eyebrow }}</span>
          <span class="tag">{{ s.model.badges[0] }}</span>
        </div>
        <component :is="i === 0 ? 'h1' : 'h2'" class="mt-5 font-display text-[2.6rem] font-bold leading-none sm:text-[3.25rem] lg:text-[4rem]">
          {{ s.model.name }}
        </component>
        <p class="mt-4 text-lg font-medium text-white/90">{{ s.headline }}</p>
        <p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/80 sm:text-base">{{ s.copy }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink
            :to="`/models/${s.model.slug}`"
            :tabindex="i === current ? 0 : -1"
            :aria-label="`View ${s.model.name}`"
            class="btn-primary"
          >
            View vehicle
          </NuxtLink>
          <NuxtLink :to="`/get-a-quote?model=${s.model.slug}`" :tabindex="i === current ? 0 : -1" class="btn-light">
            Get a quote
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Model tabs -->
    <div class="absolute inset-x-0 bottom-0 z-20">
      <div class="container-x flex items-stretch justify-center">
        <button
          v-for="(s, i) in slides"
          :key="s.model.slug"
          type="button"
          class="relative w-full max-w-[160px] px-2 py-4 text-center text-sm font-bold leading-tight transition sm:text-[15px]"
          :class="i === current ? 'bg-white/25 text-white' : 'text-white/60 hover:text-white'"
          :aria-label="`Show ${s.model.name}`"
          :aria-current="i === current"
          @click="go(i)"
        >
          {{ s.model.name }}
          <span v-if="i === current" class="absolute inset-x-0 bottom-0 h-[3px] bg-white/30">
            <span class="block h-full origin-left bg-white" :style="{ transform: `scaleX(${progress})` }" />
          </span>
        </button>
      </div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
        <div class="container-x flex justify-between pb-[26px]">
          <button type="button" class="pointer-events-auto grid size-10 place-items-center bg-black/30 transition hover:bg-black/50" aria-label="Previous slide" @click="go(current - 1)">
            <AppIcon name="chevron-left" class="size-5" />
          </button>
          <button type="button" class="pointer-events-auto grid size-10 place-items-center bg-black/30 transition hover:bg-black/50" aria-label="Next slide" @click="go(current + 1)">
            <AppIcon name="chevron-right" class="size-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
