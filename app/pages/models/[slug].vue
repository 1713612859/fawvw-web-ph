<script setup lang="ts">
// Model detail page, laid out after the BYD Philippines vehicle pages:
// dark sticky section bar → photo hero with key specs → intro + alternating feature cards →
// dark studio section → variants → full specifications → gallery → dark CTA tiles.
import { teaserMonthly } from '~/utils/finance'
import { media } from '~/data/media'
import { formatSpec, modelDetails, specRows } from '~/data/modelDetails'
import { findModel, formatPrice } from '~/data/models'

const route = useRoute()
const model = findModel(String(route.params.slug))
const detail = model ? modelDetails[model.slug] : undefined
if (!model || !detail) {
  throw createError({ statusCode: 404, statusMessage: 'Model not found', fatal: true })
}
const photos = media[model.slug] ?? { features: [], gallery: [] }

useSeoMeta({
  title: `${model.name} – Price, Specs & Features`,
  description: `${model.name}: ${model.tagline} Starts at ${formatPrice(model.priceFrom)}. Explore features, variants, specifications and book a test drive.`,
  ogImage: photos.hero?.src ?? model.image,
})

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'variants', label: 'Variants' },
  { id: 'specs', label: 'Specifications' },
  ...(photos.gallery.length ? [{ id: 'gallery', label: 'Gallery' }] : []),
]

const spec = detail.spec
const heroStats = [
  { value: spec.power, label: 'Max power' },
  { value: spec.torque, label: 'Max torque' },
  { value: spec.efficiency, label: 'Economy / range' },
  { value: `${spec.seats} seats`, label: 'Seating' },
]
const dimensions = [
  { value: formatSpec(spec, 'length', 'mm'), label: 'Length' },
  { value: formatSpec(spec, 'width', 'mm'), label: 'Width' },
  { value: formatSpec(spec, 'height', 'mm'), label: 'Height' },
  { value: formatSpec(spec, 'wheelbase', 'mm'), label: 'Wheelbase' },
]
const monthly = Math.round(teaserMonthly(model.priceFrom))
const quoteLink = `/get-a-quote?model=${model.slug}`
const driveLink = `/test-drive?model=${model.slug}`

// Gallery with Exterior / Interior tabs (tabs only when both kinds exist).
const galleryKinds = (['exterior', 'interior'] as const).filter((k) => photos.gallery.some((p) => p.kind === k))
const galleryKind = ref<'exterior' | 'interior'>(galleryKinds[0] ?? 'exterior')
const galleryList = computed(() => photos.gallery.filter((p) => p.kind === galleryKind.value))
const galleryIndex = ref(0)
watch(galleryKind, () => (galleryIndex.value = 0))
function galleryStep(d: number) {
  const n = galleryList.value.length
  galleryIndex.value = (galleryIndex.value + d + n) % n
}


// Highlight the section bar item for the section in view.
const active = ref('overview')
let observer: IntersectionObserver | undefined
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  for (const s of sections) {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div>
    <!-- Sticky section bar -->
    <div class="sticky top-16 z-30 bg-carbon text-white lg:top-20">
      <div class="container-x flex h-12 items-stretch">
        <nav class="no-scrollbar -ml-3 flex flex-1 overflow-x-auto" aria-label="Sections">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            :aria-current="active === s.id ? 'true' : undefined"
            class="relative flex items-center whitespace-nowrap px-3 text-[13px] font-medium transition"
            :class="active === s.id ? 'text-white' : 'text-white/55 hover:text-white'"
          >
            {{ s.label }}
            <span v-if="active === s.id" class="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />
          </a>
        </nav>
        <p class="hidden items-center pr-5 text-[13px] text-white/55 md:flex">{{ model.name }}</p>
        <NuxtLink :to="quoteLink" class="-mr-4 hidden items-center bg-cta px-6 text-sm font-bold uppercase text-white transition hover:bg-cta-hover sm:-mr-6 sm:flex lg:-mr-8">
          Get a Quote
        </NuxtLink>
      </div>
    </div>

    <!-- Hero -->
    <section id="overview" class="relative isolate flex h-[calc(100svh-7.5rem)] max-h-[880px] min-h-[620px] scroll-mt-32 items-end overflow-hidden bg-carbon text-white">
      <img
        v-if="photos.hero"
        :src="photos.hero.src"
        :alt="photos.hero.alt"
        fetchpriority="high"
        class="absolute inset-0 -z-20 h-full w-full object-cover"
      >
      <div v-else class="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_45%,#2a3550,#111418_70%)]">
        <div class="absolute bottom-[36%] right-[4%] aspect-[79/29] w-[88%] md:bottom-[32%] md:w-[54%]">
          <div class="absolute inset-x-[8%] bottom-[2%] h-[18%] rounded-[50%] bg-white/15 blur-2xl" aria-hidden="true" />
          <CarImage :src="model.image" :alt="model.name" eager class="relative" />
        </div>
      </div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/30 to-transparent" aria-hidden="true" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/30" aria-hidden="true" />

      <div class="container-x w-full pb-8">
        <div class="max-w-xl">
          <div class="flex flex-wrap gap-2">
            <span v-for="b in model.badges" :key="b" class="tag">{{ b }}</span>
          </div>
          <h1 class="mt-4 font-display text-5xl font-bold sm:text-6xl lg:text-[4.25rem]">{{ model.name }}</h1>
          <p class="mt-4 max-w-md text-[15px] leading-relaxed text-white/80 sm:text-base">{{ model.tagline }} {{ detail.highlights[0]?.copy }}</p>
          <p class="mt-4 text-sm text-white/70">
            Starts at <span class="text-lg font-bold text-white">{{ formatPrice(model.priceFrom) }}*</span>
            <span class="text-white/50"> · or from {{ formatPrice(monthly) }}/month*</span>
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink :to="quoteLink" class="btn-primary">
              Get a Quote
            </NuxtLink>
            <NuxtLink :to="driveLink" class="btn-light">
              Book a Test Drive
            </NuxtLink>
          </div>
        </div>

        <dl class="mt-10 grid grid-cols-2 gap-y-6 border-t border-white/20 pt-6 md:grid-cols-4 md:divide-x md:divide-white/20">
          <div v-for="s in heroStats" :key="s.label" class="px-2 text-center">
            <dd class="font-display text-xl font-bold sm:text-2xl lg:text-3xl">{{ s.value }}</dd>
            <dt class="mt-1 text-xs text-white/60">{{ s.label }}</dt>
          </div>
        </dl>
        <p class="mt-6 text-[11px] leading-relaxed text-white/50">
          *Suggested retail price, subject to change without prior notice; may vary by dealer and location. Monthly estimate assumes 20% down payment, 60 months, 8% p.a.
        </p>
      </div>
    </section>

    <!-- Intro + features -->
    <section id="features" class="scroll-mt-32 bg-mist py-16 sm:py-24">
      <div class="container-x">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="h-section">{{ model.tagline }}</h2>
          <p class="mt-5 leading-relaxed text-slate-600 sm:text-lg">{{ detail.intro }}</p>
        </div>

        <div class="mt-12 space-y-6 sm:mt-16 sm:space-y-8">
          <article
            v-for="(h, i) in detail.highlights"
            :key="h.title"
            class="grid overflow-hidden border border-line bg-white md:grid-cols-2"
          >
            <div
              class="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,0_100%)]"
              :class="i % 2 === 1 && 'md:order-2'"
            >
              <img
                v-if="photos.features[i]"
                :src="photos.features[i]!.src"
                :alt="photos.features[i]!.alt"
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover"
              >
              <div v-else class="absolute inset-0 flex items-center bg-gradient-to-b from-white to-slate-200/80 px-6">
                <div class="aspect-[79/29] w-full"><CarImage :src="model.image" :alt="model.name" /></div>
              </div>
            </div>
            <div class="flex flex-col justify-center p-7 sm:p-12">
              <h3 class="font-display text-[1.75rem] font-bold leading-tight sm:text-4xl">{{ h.title }}</h3>
              <p class="mt-4 leading-relaxed text-slate-600">{{ h.copy }}</p>
              <p class="mt-6 text-xs italic text-slate-400">*Specifications may change without prior notice.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Studio view with key dimensions -->
    <section class="bg-carbon py-16 text-white sm:py-24">
      <div class="container-x text-center">
        <h2 class="font-display text-[2rem] font-bold sm:text-[2.75rem]">Designed to stand out</h2>
        <p class="mt-3 text-white/60">The {{ model.name }}, engineered to Volkswagen standards.</p>
        <div class="relative mx-auto mt-10 aspect-[79/29] max-w-4xl">
          <div class="absolute inset-x-[10%] bottom-[2%] h-[16%] rounded-[50%] bg-white/15 blur-2xl" aria-hidden="true" />
          <CarImage :src="model.image" :alt="`${model.name} studio side profile`" class="relative" />
        </div>
        <dl class="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="d in dimensions" :key="d.label" class="border border-white/15 bg-white/5 px-4 py-4">
            <dd class="text-lg font-bold sm:text-xl">{{ d.value }}</dd>
            <dt class="mt-1 text-[11px] uppercase tracking-wider text-white/50">{{ d.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- Variants -->
    <section id="variants" class="scroll-mt-32 py-16 sm:py-24">
      <div class="container-x">
        <p class="eyebrow">Variants &amp; prices</p>
        <h2 class="h-section mt-3">Choose your {{ model.name }}</h2>
        <div class="mt-10 grid gap-5 md:grid-cols-2">
          <div v-for="(v, i) in detail.variants" :key="v.name" class="flex flex-col border border-line bg-white p-7">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-slate-500">{{ model.name }}</p>
                <h3 class="mt-1 font-display text-2xl font-bold">{{ v.name }}</h3>
              </div>
              <span v-if="i === detail.variants.length - 1" class="tag-dark">Top of the range</span>
            </div>
            <p class="mt-5 text-3xl font-bold text-brand-900">{{ formatPrice(v.price) }}*</p>
            <p class="text-sm text-slate-500">or from {{ formatPrice(Math.round(teaserMonthly(v.price))) }}/month*</p>
            <ul class="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
              <li v-for="f in v.features" :key="f" class="flex items-center gap-2.5 text-sm text-slate-700">
                <AppIcon name="check" class="size-4 text-brand-700" /> {{ f }}
              </li>
            </ul>
            <div class="mt-auto grid grid-cols-2 gap-2 pt-8">
              <NuxtLink :to="`${quoteLink}&variant=${i}`" class="btn-primary btn-sm">Get a Quote</NuxtLink>
              <NuxtLink :to="driveLink" class="btn-outline btn-sm">Test Drive</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Full specifications -->
    <section id="specs" class="scroll-mt-32 border-t border-line bg-white py-16 sm:py-24">
      <div class="container-x">
        <p class="eyebrow">Full specifications</p>
        <h2 class="h-section mt-3">{{ model.name }} Specifications</h2>
        <p class="mt-4 text-sm text-slate-600">Starts at <strong class="text-ink">{{ formatPrice(model.priceFrom) }}</strong></p>
        <div class="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <NuxtLink to="/price-list" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-brand-700">
            <span class="grid size-6 place-items-center rounded-full bg-cta text-white"><AppIcon name="arrow-right" class="size-3.5" /></span>
            Price list
          </NuxtLink>
          <NuxtLink :to="`/compare?models=${model.slug}`" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-brand-700">
            <span class="grid size-6 place-items-center rounded-full bg-cta text-white"><AppIcon name="arrow-right" class="size-3.5" /></span>
            Compare with other models
          </NuxtLink>
        </div>
        <p class="mt-3 text-xs text-slate-400">*FAW-VW Philippines reserves the right to change or modify vehicle specifications without prior notice.</p>

        <div class="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
          <div v-for="g in specRows" :key="g.group">
            <h3 class="font-display text-2xl font-bold text-cta">{{ g.group }}</h3>
            <dl class="mt-5">
              <div v-for="r in g.rows" :key="r.key" class="border-b border-line py-4">
                <dt class="text-xs italic text-slate-400">{{ r.label }}</dt>
                <dd class="mt-1 text-lg font-bold text-ink">{{ formatSpec(spec, r.key, r.unit) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section v-if="photos.gallery.length" id="gallery" class="scroll-mt-32 bg-carbon">
      <div class="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[21/9]">
        <img
          v-for="(p, i) in galleryList"
          :key="p.src"
          :src="p.src"
          :alt="p.alt"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          :class="i === galleryIndex ? 'opacity-100' : 'opacity-0'"
          :aria-hidden="i !== galleryIndex"
        >
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <template v-if="galleryList.length > 1">
          <button type="button" class="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60" aria-label="Previous photo" @click="galleryStep(-1)">
            <AppIcon name="chevron-left" class="size-5" />
          </button>
          <button type="button" class="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60" aria-label="Next photo" @click="galleryStep(1)">
            <AppIcon name="chevron-right" class="size-5" />
          </button>
          <div class="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
            <button
              v-for="(p, i) in galleryList"
              :key="p.src"
              type="button"
              class="h-12 w-20 overflow-hidden ring-2 transition sm:h-14 sm:w-24"
              :class="i === galleryIndex ? 'ring-white' : 'ring-transparent opacity-70 hover:opacity-100'"
              :aria-label="`Show photo ${i + 1}: ${p.alt}`"
              :aria-current="i === galleryIndex ? 'true' : undefined"
              @click="galleryIndex = i"
            >
              <img :src="p.src" alt="" loading="lazy" class="h-full w-full object-cover">
            </button>
          </div>
        </template>
      </div>
      <div v-if="galleryKinds.length > 1" class="flex justify-center" role="tablist" aria-label="Gallery">
        <button
          v-for="k in galleryKinds"
          :key="k"
          type="button"
          role="tab"
          :aria-selected="galleryKind === k"
          class="w-44 py-4 text-sm font-bold uppercase transition"
          :class="galleryKind === k ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'"
          @click="galleryKind = k"
        >
          {{ k }}
        </button>
      </div>
    </section>

    <CtaTiles :model="model.slug" :photo="(photos.features.find(Boolean) ?? photos.gallery[0])?.src" />
  </div>
</template>
