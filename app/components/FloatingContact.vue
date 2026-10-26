<script setup lang="ts">
import { site } from '~/data/site'

const showTop = ref(false)
// On phones the three contact buttons collapse behind one toggle to keep content visible.
const expanded = ref(false)
function onScroll() {
  showTop.value = window.scrollY > 600
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const buttons = [
  { label: 'Chat on Messenger', href: site.messenger, icon: 'messenger', cls: 'bg-[#0866FF]' },
  { label: 'Chat on Viber', href: site.viber, icon: 'viber', cls: 'bg-[#7360F2]' },
  { label: `Call ${site.hotline}`, href: site.hotlineHref, icon: 'phone', cls: 'bg-brand-900' },
] as const
</script>

<template>
  <div class="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 sm:right-6">
    <div class="flex-col items-end gap-2.5" :class="expanded ? 'flex' : 'hidden sm:flex'">
      <a
        v-for="b in buttons"
        :key="b.label"
        :href="b.href"
        target="_blank"
        rel="noopener"
        :aria-label="b.label"
        class="group relative grid size-12 place-items-center rounded-full text-white shadow-lg shadow-slate-900/20 transition hover:scale-105"
        :class="b.cls"
      >
        <AppIcon :name="b.icon" class="size-[22px]" />
        <span class="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 lg:block">
          {{ b.label }}
        </span>
      </a>
    </div>
    <button
      type="button"
      class="grid size-12 place-items-center rounded-full bg-brand-900 text-white shadow-lg shadow-slate-900/25 transition sm:hidden"
      :aria-label="expanded ? 'Close contact options' : 'Contact us'"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <AppIcon :name="expanded ? 'close' : 'messenger'" class="size-[22px]" />
    </button>
    <Transition enter-from-class="opacity-0 translate-y-2" enter-active-class="transition" leave-active-class="transition" leave-to-class="opacity-0 translate-y-2">
      <button
        v-if="showTop"
        type="button"
        aria-label="Back to top"
        class="grid size-12 place-items-center rounded-full bg-white text-ink shadow-lg shadow-slate-900/15 ring-1 ring-slate-200 transition hover:scale-105"
        @click="toTop"
      >
        <AppIcon name="arrow-up" class="size-5" />
      </button>
    </Transition>
  </div>
</template>
