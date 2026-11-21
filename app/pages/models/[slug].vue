<script setup lang="ts">
// Model detail page: dark sticky section bar → photo hero with headline figures →
// fawcar.com feature blocks → studio view with colours and dimensions → variants →
// full specification sheet (all variants, "differences only" toggle) → gallery → CTA tiles.
// No prices: Philippine prices are quoted by the dealers.
import { colorImage, media } from '~/data/media'
import { modelDetails } from '~/data/modelDetails'
import { findModel, powertrainLabel } from '~/data/models'
import { headlineStats, sourceUrl, specSheets, specValues, summarize, variantDifferences } from '~/data/specs'

const route = useRoute()
const model = findModel(String(route.params.slug))
const detail = model ? modelDetails[model.slug] : undefined
const sheet = model ? specSheets[model.slug] : undefined
const photos = model ? media[model.slug] : undefined
if (!model || !detail || !sheet || !photos) {
  throw createError({ statusCode: 404, statusMessage: 'Model not found', fatal: true })
}

useSeoMeta({
  title: `${model.name} – Specs, Colors & Features`,
  description: `${model.name}: ${model.tagline}. ${model.body}, ${powertrainLabel(model).toLowerCase()}. Explore features, colors, variants and full specifications, then request a quote.`,
  ogImage: photos.hero.src,
})

const sections = [
  { id: 'overview', label: 'Overview' },
  ...(detail.highlights.length ? [{ id: 'features', label: 'Features' }] : []),
  { id: 'design', label: 'Colors' },
  { id: 'variants', label: 'Variants' },
  { id: 'specs', label: 'Specifications' },
  { id: 'gallery', label: 'Gallery' },
]

const heroStats = headlineStats(model.slug)
const dims = (label: string, key: string) => ({ label, value: summarize(specValues(model.slug, [key]), 'mm') ?? '–' })
const dimensions = [
  dims('Length', 'Length (mm)'),
  dims('Width', 'Width (mm)'),
  dims('Height', 'Height (mm)'),
  dims('Wheelbase', 'Wheelbase (mm)'),
]
const quoteLink = `/get-a-quote?model=${model.slug}`
const driveLink = `/test-drive?model=${model.slug}`
const badges = [model.brand, model.body, powertrainLabel(model)]

// Colour picker (studio view): one cut-out per colour. A colour's photo is put on the page
// when its swatch is hovered, focused or picked, so hidden photos are never left half-loaded.
const colorIndex = ref(0)
const colorLoaded = reactive(new Set([0]))
function pickColor(i: number) {
  colorLoaded.add(i)
  colorIndex.value = i
}

// Variants: what each one adds, from the rows that differ.
const variants = sheet.variants.map((name, i) => ({ name, extras: variantDifferences(model.slug, i) }))

// Specification sheet. "Differences only" keeps rows whose value varies between variants.
const diffOnly = ref(false)
const multi = sheet.variants.length > 1
const specGroups = computed(() =>
  sheet.groups
    .map((g) => ({ ...g, rows: diffOnly.value ? g.rows.filter((r) => new Set(r.values).size > 1) : g.rows }))
    .filter((g) => g.rows.length),
)
const openGroups = reactive(new Set(sheet.groups.slice(0, 2).map((g) => g.name)))
const allOpen = computed(() => specGroups.value.every((g) => openGroups.has(g.name)))
function toggleAll() {
  const open = !allOpen.value
  for (const g of sheet.groups) open ? openGroups.add(g.name) : openGroups.delete(g.name)
}
function onToggle(name: string, e: Event) {
  ;(e.target as HTMLDetailsElement).open ? openGroups.add(name) : openGroups.delete(name)
}
const sameValue = (values: string[]) => new Set(values).size === 1

// Gallery with Exterior / Interior tabs (tabs only when both kinds exist).
const galleryKinds = (['exterior', 'interior'] as const).filter((k) => photos.gallery.some((p) => p.kind === k))
const galleryKind = ref<'exterior' | 'interior'>(galleryKinds[0] ?? 'exterior')
const galleryList = computed(() => photos.gallery.filter((p) => p.kind === galleryKind.value))
const galleryCaption = computed(() => (galleryKind.value === 'interior' ? detail.interior : detail.design))
const galleryIndex = ref(0)
watch(galleryKind, () => (galleryIndex.value = 0))
function galleryStep(d: number) {
  const n = galleryList.value.length
  galleryIndex.value = (galleryIndex.value + d + n) % n
}
// Only the current and the next large photo are put on the page; others load when reached.
const galleryLoaded = reactive(new Set<string>())
watchEffect(() => {
  const list = galleryList.value
  if (!list.length) return
  galleryLoaded.add(list[galleryIndex.value % list.length]!.src)
  if (list.length > 1) galleryLoaded.add(list[(galleryIndex.value + 1) % list.length]!.src)
})

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
    <section id="overview" class="relative isolate flex min-h-[620px] scroll-mt-32 items-end overflow-hidden bg-carbon text-white sm:h-[calc(100svh-7.5rem)] sm:max-h-[880px]">
      <img
        :src="photos.hero.src"
        :alt="photos.hero.alt"
        fetchpriority="high"
        class="absolute inset-0 -z-20 h-full w-full object-cover"
      >
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/30 to-transparent" aria-hidden="true" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/30" aria-hidden="true" />

      <div class="container-x w-full pb-8 pt-24 sm:pt-0">
        <div class="max-w-xl">
          <div class="flex flex-wrap gap-2">
            <span v-for="b in badges" :key="b" class="tag">{{ b }}</span>
          </div>
          <h1 class="mt-4 font-display text-5xl font-bold sm:text-6xl lg:text-[4.25rem]">{{ model.name }}</h1>
          <p class="mt-4 max-w-md text-lg font-medium text-white sm:text-xl">{{ model.tagline }}</p>
          <p class="mt-2 max-w-md text-[15px] leading-relaxed text-white/75">{{ detail.design.copy }}</p>
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
          Figures from the manufacturer's specification sheet; ranges cover all variants. Electric range and fuel use are CLTC / WLTC test values; real-world results vary.
        </p>
      </div>
    </section>

    <!-- Feature blocks -->
    <section v-if="detail.highlights.length" id="features" class="scroll-mt-32 bg-mist py-16 sm:py-24">
      <div class="container-x">
        <p class="eyebrow">Highlights</p>
        <h2 class="h-section mt-3 max-w-3xl">{{ model.tagline }}</h2>

        <div class="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
          <div v-for="g in detail.highlights" :key="g.title">
            <h3 class="max-w-3xl border-l-4 border-cta pl-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{{ g.title }}</h3>
            <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="h in g.items" :key="h.title" class="notch flex flex-col border border-line bg-white p-6 sm:p-7">
                <AppIcon name="check" class="size-5 text-cta" />
                <p class="mt-3 font-display text-lg font-bold leading-snug text-ink">{{ h.title }}</p>
                <p v-if="h.copy" class="mt-2 text-[15px] leading-relaxed text-slate-600">{{ h.copy }}</p>
              </li>
            </ul>
          </div>
        </div>
        <p class="mt-10 text-xs italic text-slate-400">*Features vary by variant and market; see the specifications for each variant.</p>
      </div>
    </section>

    <!-- Studio view: colours and key dimensions -->
    <section id="design" class="scroll-mt-32 bg-carbon py-16 text-white sm:py-24">
      <div class="container-x text-center">
        <h2 class="mx-auto max-w-3xl font-display text-[2rem] font-bold leading-tight sm:text-[2.75rem]">{{ detail.design.title }}</h2>
        <p class="mx-auto mt-3 max-w-2xl text-white/60">{{ detail.design.copy }}</p>

        <div class="relative mx-auto mt-10 aspect-[17/10] max-w-3xl">
          <div class="absolute inset-x-[12%] bottom-[8%] h-[14%] rounded-[50%] bg-white/10 blur-2xl" aria-hidden="true" />
          <template v-if="detail.colors.length">
            <template v-for="(c, i) in detail.colors" :key="c.name">
              <img
                v-if="colorLoaded.has(i)"
                v-show="i === colorIndex"
                :src="colorImage(model.slug, i + 1)"
                :alt="`${model.name} in ${c.name}`"
                width="850"
                height="500"
                :loading="i === 0 ? 'lazy' : 'eager'"
                decoding="async"
                data-color-photo
                class="relative h-full w-full object-contain"
              >
            </template>
          </template>
          <CarImage v-else :src="model.image" :alt="`${model.name} side view`" class="relative" />
        </div>

        <div v-if="detail.colors.length" class="mt-6">
          <div class="flex flex-wrap justify-center gap-3" role="radiogroup" :aria-label="`${model.name} colors`">
            <button
              v-for="(c, i) in detail.colors"
              :key="c.name"
              type="button"
              role="radio"
              :aria-checked="i === colorIndex"
              :aria-label="c.name"
              :title="c.name"
              class="size-9 rounded-full border-2 transition"
              :class="i === colorIndex ? 'border-white ring-2 ring-white/40 ring-offset-2 ring-offset-carbon' : 'border-white/25 hover:border-white/60'"
              :style="{ backgroundColor: c.hex }"
              @pointerenter="colorLoaded.add(i)"
              @focus="colorLoaded.add(i)"
              @click="pickColor(i)"
            />
          </div>
          <p class="mt-3 text-sm font-medium" aria-live="polite">{{ detail.colors[colorIndex]?.name }}</p>
          <p class="mt-1 text-xs text-white/45">Colors shown on fawcar.com; availability in the Philippines to be confirmed by your dealer.</p>
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
        <p class="eyebrow">Variants</p>
        <h2 class="h-section mt-3">Choose your {{ model.name }}</h2>
        <p class="mt-3 max-w-2xl text-slate-600">Prices and availability for the Philippines come from your dealer. Request a quote for the variant you like.</p>
        <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="(v, i) in variants" :key="v.name" class="flex flex-col border border-line bg-white p-7">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-slate-500">{{ model.name }}</p>
                <h3 class="mt-1 font-display text-2xl font-bold">{{ v.name }}</h3>
              </div>
              <span v-if="multi && i === variants.length - 1" class="tag-dark shrink-0">Top of the range</span>
            </div>
            <ul v-if="v.extras.length" class="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
              <li v-for="f in v.extras" :key="f" class="flex items-start gap-2.5 text-sm text-slate-700">
                <AppIcon name="check" class="mt-0.5 size-4 shrink-0 text-cta" /> {{ f }}
              </li>
            </ul>
            <p v-else class="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-500">Base variant. See the full specifications below.</p>
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
        <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <NuxtLink :to="`/compare?models=${model.slug}`" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-cta">
            <span class="grid size-6 place-items-center rounded-full bg-cta text-white"><AppIcon name="arrow-right" class="size-3.5" /></span>
            Compare with other models
          </NuxtLink>
          <NuxtLink :to="quoteLink" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-cta">
            <span class="grid size-6 place-items-center rounded-full bg-cta text-white"><AppIcon name="arrow-right" class="size-3.5" /></span>
            Request a quote
          </NuxtLink>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <p class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <span><span class="font-bold text-ink">●</span> Standard</span>
            <span><span class="font-bold text-ink">○</span> Optional</span>
            <span><span class="font-bold text-ink">–</span> Not available</span>
          </p>
          <div class="flex flex-wrap items-center gap-5">
            <label v-if="multi" class="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input v-model="diffOnly" type="checkbox" class="size-4 accent-[var(--color-cta)]" data-diff-toggle>
              Show differences only
            </label>
            <button type="button" class="text-sm font-semibold text-cta hover:underline" @click="toggleAll">
              {{ allOpen ? 'Collapse all' : 'Expand all' }}
            </button>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <details
            v-for="g in specGroups"
            :key="g.name"
            :open="openGroups.has(g.name)"
            class="group border border-line"
            @toggle="onToggle(g.name, $event)"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between bg-mist px-4 py-3.5 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
              {{ g.name }}
              <span class="flex items-center gap-3 text-xs font-normal text-slate-500">
                {{ g.rows.length }} {{ g.rows.length === 1 ? 'item' : 'items' }}
                <AppIcon name="chevron-down" class="size-5 transition-transform group-open:rotate-180" />
              </span>
            </summary>
            <div class="overflow-x-auto">
              <table class="w-full text-sm" :class="multi && 'min-w-[640px]'">
                <thead>
                  <tr class="border-b border-line text-left">
                    <th scope="col" class="sticky left-0 w-[28%] min-w-[150px] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Item</th>
                    <th v-for="v in sheet.variants" :key="v" scope="col" class="px-4 py-3 text-xs font-bold text-ink">{{ v }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in g.rows" :key="r.label" class="border-b border-slate-100 last:border-0" :class="multi && !sameValue(r.values) && 'bg-cta/[0.03]'">
                    <th scope="row" class="sticky left-0 bg-white px-4 py-3 text-left align-top font-medium text-slate-500">{{ r.label }}</th>
                    <template v-if="sameValue(r.values)">
                      <td :colspan="sheet.variants.length" class="px-4 py-3 align-top text-ink"><SpecValue :value="r.values[0]!" /></td>
                    </template>
                    <template v-else>
                      <td v-for="(val, i) in r.values" :key="i" class="px-4 py-3 align-top text-ink"><SpecValue :value="val" /></td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
        <p class="mt-6 text-xs leading-relaxed text-slate-400">
          Source: manufacturer's specification sheet on
          <a :href="sourceUrl(model.slug)" target="_blank" rel="noopener" class="underline hover:text-ink">fawcar.com</a>
          (GCC-market variants where several markets are listed). Philippine specifications may differ; FAWCAR Philippines reserves the right to change specifications without prior notice.
        </p>
      </div>
    </section>

    <!-- Gallery -->
    <section id="gallery" class="scroll-mt-32 bg-carbon">
      <div class="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[21/9]">
        <template v-for="(p, i) in galleryList" :key="p.src">
          <img
            v-if="galleryLoaded.has(p.src)"
            :src="p.src"
            :alt="p.alt"
            loading="lazy"
            decoding="async"
            data-gallery-photo
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            :class="i === galleryIndex ? 'opacity-100' : 'opacity-0'"
            :aria-hidden="i !== galleryIndex"
          >
        </template>
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
              <img :src="p.thumb" alt="" loading="lazy" width="240" height="135" class="h-full w-full object-cover">
            </button>
          </div>
        </template>
      </div>
      <div class="container-x flex flex-col items-center gap-4 py-6 text-center text-white sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p class="font-display text-lg font-bold">{{ galleryCaption.title }}</p>
          <p class="text-sm text-white/55">{{ galleryCaption.copy }}</p>
        </div>
        <div v-if="galleryKinds.length > 1" class="flex shrink-0" role="tablist" aria-label="Gallery">
          <button
            v-for="k in galleryKinds"
            :key="k"
            type="button"
            role="tab"
            :aria-selected="galleryKind === k"
            class="w-36 py-3 text-sm font-bold uppercase transition"
            :class="galleryKind === k ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'"
            @click="galleryKind = k"
          >
            {{ k }}
          </button>
        </div>
      </div>
    </section>

    <CtaTiles :model="model.slug" :photo="(photos.gallery.find((p) => p.kind === 'exterior' && p !== photos.hero) ?? photos.hero).src" />
  </div>
</template>
