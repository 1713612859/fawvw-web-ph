<script setup lang="ts">
// Navy footer as on most carmaker sites: link columns on desktop, an accordion on phones
// (one row per group, tap to open) so the page doesn't end in a long list.
import { models } from '~/data/models'
import { companyLinks, companyName, legalLinks, ownerLinks, shoppingTools, site } from '~/data/site'
import type { IconName } from '~/utils/icons'

const columns = [
  {
    title: 'Models',
    links: [...models.map((m) => ({ label: m.name, to: `/models/${m.slug}` })), { label: 'All models', to: '/models' }],
  },
  { title: 'Shopping tools', links: shoppingTools },
  { title: 'Owners', links: ownerLinks },
  { title: 'About FAWCAR', links: companyLinks },
]

const socialIcon: Record<string, IconName> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  TikTok: 'tiktok',
  YouTube: 'youtube',
}

const open = ref<string | null>(null)
const toggle = (title: string) => (open.value = open.value === title ? null : title)

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-brand-950 text-white">
    <div class="container-x pb-10 pt-12 lg:pt-16">
      <div class="grid gap-10 lg:grid-cols-[1.1fr_2fr] lg:gap-12">
        <div>
          <BrandLogo light />
          <p class="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">
            FAWCAR in the Philippines: JOYEE and BESTUNE cars from China FAW, with sales and after-sales support through our dealer network.
          </p>
          <ul class="mt-6 space-y-3 text-[15px] text-white/85">
            <li>
              <a :href="site.hotlineHref" class="flex items-center gap-3 hover:text-white">
                <AppIcon name="phone" class="size-4" /> {{ site.hotline }}
              </a>
            </li>
            <li>
              <a :href="`mailto:${site.email}`" class="flex items-center gap-3 hover:text-white">
                <AppIcon name="mail" class="size-4" /> {{ site.email }}
              </a>
            </li>
            <li class="flex items-start gap-3">
              <AppIcon name="pin" class="mt-0.5 size-4 shrink-0" /> {{ site.address }}
            </li>
          </ul>
        </div>

        <!-- Link groups: accordion below md, columns from md -->
        <div class="-mx-4 border-t border-white/10 sm:-mx-6 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:border-0">
          <div v-for="col in columns" :key="col.title" class="border-b border-white/10 md:border-0">
            <p class="hidden font-display text-base font-semibold uppercase md:block">{{ col.title }}</p>
            <button
              type="button"
              class="flex w-full items-center justify-between px-4 py-4 text-left text-[15px] font-semibold sm:px-6 md:hidden"
              :aria-expanded="open === col.title"
              @click="toggle(col.title)"
            >
              {{ col.title }}
              <AppIcon name="chevron-right" class="size-4 text-white/60 transition-transform" :class="open === col.title && 'rotate-90'" />
            </button>
            <ul
              class="space-y-2.5 px-4 pb-4 sm:px-6 md:mt-4 md:block md:px-0 md:pb-0"
              :class="open === col.title ? 'block' : 'hidden'"
            >
              <li v-for="l in col.links" :key="l.to">
                <NuxtLink :to="l.to" class="text-sm text-white/70 transition hover:text-white">{{ l.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-6 border-white/10 md:border-t md:pt-8">
        <p class="font-display text-base font-semibold uppercase">Follow us</p>
        <div class="flex gap-2">
          <a
            v-for="s in site.socials"
            :key="s.name"
            :href="s.href"
            target="_blank"
            rel="noopener"
            :aria-label="s.name"
            class="grid size-10 place-items-center bg-white/10 text-white transition hover:bg-white/20"
          >
            <AppIcon :name="socialIcon[s.name] ?? 'arrow-right'" class="size-[18px]" />
          </a>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-4 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
        <p>© {{ year }} {{ companyName }}. All rights reserved.</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          <li v-for="l in legalLinks" :key="l.to">
            <NuxtLink :to="l.to" class="hover:text-white">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
