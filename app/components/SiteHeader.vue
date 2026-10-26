<script setup lang="ts">
import { categories, formatPrice, models } from '~/data/models'
import { ownerLinks, shoppingTools, site } from '~/data/site'

type MenuKey = 'models' | 'tools' | 'owners'

const menus: { key: MenuKey; label: string }[] = [
  { key: 'models', label: 'Models' },
  { key: 'tools', label: 'Shopping Tools' },
  { key: 'owners', label: 'Owners' },
]
const simpleLinks = [
  { label: 'Dealers', to: '/dealers' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
]
const modelSideLinks = [
  { label: 'All models', to: '/models' },
  { label: 'Compare models', to: '/compare' },
  { label: 'Price list', to: '/price-list' },
  { label: 'Book a test drive', to: '/test-drive' },
]

const openMenu = ref<MenuKey | null>(null)
const mobileOpen = ref(false)
const mobileSection = ref<MenuKey | null>('models')
const scrolled = ref(false)
const route = useRoute()

let closeTimer: ReturnType<typeof setTimeout> | undefined
function enter(key: MenuKey) {
  clearTimeout(closeTimer)
  openMenu.value = key
}
function leave() {
  closeTimer = setTimeout(() => (openMenu.value = null), 120)
}
function toggleMobileSection(key: MenuKey) {
  mobileSection.value = mobileSection.value === key ? null : key
}

watch(() => route.fullPath, () => {
  openMenu.value = null
  mobileOpen.value = false
})
watch(mobileOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

const headerEl = ref<HTMLElement>()

function onScroll() {
  scrolled.value = window.scrollY > 8
}
// Hover opens the menu on desktop; on touch tablets a tap opens it and a tap outside closes it.
function onDocumentClick(e: MouseEvent) {
  if (openMenu.value && !headerEl.value?.contains(e.target as Node)) openMenu.value = null
}
// Escape closes the mega menu or the mobile drawer wherever focus is.
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  openMenu.value = null
  mobileOpen.value = false
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

const panelLinks = computed(() => (openMenu.value === 'owners' ? ownerLinks : shoppingTools))
</script>

<template>
  <header
    ref="headerEl"
    class="sticky top-0 z-50 bg-white transition-shadow"
    :class="scrolled || openMenu ? 'shadow-[0_1px_0_rgba(15,23,42,0.06),0_10px_30px_-18px_rgba(15,23,42,0.35)]' : 'shadow-[0_1px_0_rgba(15,23,42,0.06)]'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:h-20 lg:px-8">
      <NuxtLink to="/" aria-label="FAW-VW Philippines home">
        <BrandLogo />
      </NuxtLink>

      <nav class="ml-8 hidden h-full items-stretch lg:flex" aria-label="Main">
        <div
          v-for="m in menus"
          :key="m.key"
          class="relative flex"
          @mouseenter="enter(m.key)"
          @mouseleave="leave"
        >
          <button
            type="button"
            class="flex items-center gap-1 px-3 text-[15px] font-semibold uppercase transition-colors hover:text-cta"
            :class="openMenu === m.key ? 'text-cta' : 'text-ink'"
            :aria-expanded="openMenu === m.key"
            @click="enter(m.key)"
          >
            {{ m.label }}
            <AppIcon name="chevron-down" class="size-4 transition-transform" :class="openMenu === m.key && 'rotate-180'" />
          </button>
          <span
            class="absolute inset-x-3 bottom-0 h-[3px] origin-left bg-cta transition-transform duration-200"
            :class="openMenu === m.key ? 'scale-x-100' : 'scale-x-0'"
          />
        </div>
        <NuxtLink
          v-for="l in simpleLinks"
          :key="l.to"
          :to="l.to"
          class="flex items-center px-3 text-[15px] font-semibold uppercase text-ink transition-colors hover:text-cta"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <NuxtLink
          to="/test-drive"
          class="mr-3 hidden text-sm font-bold uppercase text-ink transition-colors hover:text-cta xl:inline-flex"
        >
          Book a Test Drive
        </NuxtLink>
        <NuxtLink
          to="/get-a-quote"
          class="btn-primary btn-sm !hidden sm:!inline-flex"
        >
          Get a Quote
        </NuxtLink>
        <button
          type="button"
          class="-mr-2 grid size-10 place-items-center text-ink hover:bg-mist lg:hidden"
          aria-label="Open menu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = true"
        >
          <AppIcon name="menu" class="size-6" />
        </button>
      </div>
    </div>

    <!-- Desktop mega menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="openMenu"
        class="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] lg:block"
        @mouseenter="enter(openMenu)"
        @mouseleave="leave"
      >
        <div class="mx-auto max-w-7xl px-8 py-8">
          <div v-if="openMenu === 'models'" class="grid grid-cols-[1fr_220px] gap-10">
            <div class="grid grid-cols-3 gap-8">
              <div v-for="c in categories" :key="c.key">
                <p class="mb-3 font-display text-sm font-bold uppercase text-ink">{{ c.label }}</p>
                <ul class="space-y-1">
                  <li v-for="m in models.filter((x) => x.category === c.key)" :key="m.slug">
                    <NuxtLink :to="`/models/${m.slug}`" class="group -mx-2 flex items-center gap-3 p-2 hover:bg-mist">
                      <div class="h-11 w-24 shrink-0 bg-gradient-to-b from-slate-50 to-slate-200/70 px-1">
                        <CarImage :src="m.image" alt="" :label="false" />
                      </div>
                      <div>
                        <p class="font-semibold text-ink group-hover:text-cta">{{ m.name }}</p>
                        <p class="text-xs text-slate-500">From {{ formatPrice(m.priceFrom) }}</p>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
            <ul class="space-y-1 border-l border-slate-100 pl-8">
              <li v-for="l in modelSideLinks" :key="l.to">
                <NuxtLink :to="l.to" class="group flex items-center justify-between py-2 text-sm font-bold uppercase text-ink hover:text-cta">
                  {{ l.label }}
                  <AppIcon name="arrow-right" class="size-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </NuxtLink>
              </li>
            </ul>
          </div>
          <ul v-else class="grid grid-cols-3 gap-3">
            <li v-for="l in panelLinks" :key="l.to">
              <NuxtLink :to="l.to" class="notch group block border border-line p-5 transition hover:bg-mist">
                <p class="flex items-center justify-between font-display text-lg font-bold text-ink group-hover:text-cta">
                  {{ l.label }}
                  <AppIcon name="arrow-right" class="size-4 opacity-40 group-hover:opacity-100" />
                </p>
                <p class="mt-1 text-sm text-slate-500">{{ l.desc }}</p>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </Transition>

    <!-- Mobile drawer: teleported to <body> because the header's backdrop-blur would clip a fixed child -->
    <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-4"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
          <BrandLogo />
          <button type="button" class="-mr-2 grid size-10 place-items-center hover:bg-mist" aria-label="Close menu" @click="mobileOpen = false">
            <AppIcon name="close" class="size-6" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 pb-6 sm:px-6" aria-label="Mobile">
          <div v-for="m in menus" :key="m.key" class="border-b border-slate-100">
            <button
              type="button"
              class="flex w-full items-center justify-between py-4 text-left text-lg font-bold uppercase"
              :aria-expanded="mobileSection === m.key"
              @click="toggleMobileSection(m.key)"
            >
              {{ m.label }}
              <AppIcon name="chevron-down" class="size-5 transition-transform" :class="mobileSection === m.key && 'rotate-180'" />
            </button>
            <div v-if="mobileSection === m.key" class="pb-4">
              <div v-if="m.key === 'models'" class="grid grid-cols-2 gap-3">
                <NuxtLink
                  v-for="car in models"
                  :key="car.slug"
                  :to="`/models/${car.slug}`"
                  class="border border-line p-3"
                >
                  <div class="aspect-[5/2]">
                    <CarImage :src="car.image" alt="" :label="false" />
                  </div>
                  <p class="mt-2 text-sm font-semibold">{{ car.name }}</p>
                  <p class="text-xs text-slate-500">From {{ formatPrice(car.priceFrom) }}</p>
                </NuxtLink>
              </div>
              <ul v-else class="space-y-1">
                <li v-for="l in m.key === 'tools' ? shoppingTools : ownerLinks" :key="l.to">
                  <NuxtLink :to="l.to" class="block py-2 text-[15px] text-slate-600">{{ l.label }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <NuxtLink
            v-for="l in simpleLinks"
            :key="l.to"
            :to="l.to"
            class="block border-b border-slate-100 py-4 text-lg font-bold uppercase"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>

        <div class="shrink-0 space-y-3 border-t border-slate-100 p-4 sm:px-6">
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink to="/test-drive" class="btn-outline">Test Drive</NuxtLink>
            <NuxtLink to="/get-a-quote" class="btn-primary">Get a Quote</NuxtLink>
          </div>
          <a :href="site.hotlineHref" class="flex items-center justify-center gap-2 text-sm text-slate-500">
            <AppIcon name="phone" class="size-4" /> {{ site.hotline }}
          </a>
        </div>
      </div>
    </Transition>
    </Teleport>
  </header>
</template>
