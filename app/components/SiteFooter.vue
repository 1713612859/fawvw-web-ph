<script setup lang="ts">
// Footer in the BYD Philippines style: light grey, uppercase column headings.
import { models } from '~/data/models'
import { companyLinks, companyName, legalLinks, ownerLinks, shoppingTools, site } from '~/data/site'
import type { IconName } from '~/utils/icons'

const columns = [
  { title: 'Models', links: [...models.map((m) => ({ label: m.name, to: `/models/${m.slug}` })), { label: 'All models', to: '/models' }] },
  { title: 'Tools', links: shoppingTools },
  { title: 'Owners', links: ownerLinks },
  { title: 'Learn', links: companyLinks },
]

const socialIcon: Record<string, IconName> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  TikTok: 'tiktok',
  YouTube: 'youtube',
}

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[#eeeeee] text-ink">
    <div class="container-x pb-10 pt-16">
      <div class="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <BrandLogo />
          <p class="mt-6 max-w-sm text-[15px] leading-relaxed text-[#444]">
            The official home of FAW-Volkswagen vehicles in the Philippines: sedans, SUVs and electrified models, backed by a nationwide dealer network.
          </p>
          <ul class="mt-6 space-y-3 text-[15px]">
            <li>
              <a :href="site.hotlineHref" class="flex items-center gap-3 hover:text-cta">
                <AppIcon name="phone" class="size-4" /> {{ site.hotline }}
              </a>
            </li>
            <li>
              <a :href="`mailto:${site.email}`" class="flex items-center gap-3 hover:text-cta">
                <AppIcon name="mail" class="size-4" /> {{ site.email }}
              </a>
            </li>
            <li class="flex items-start gap-3">
              <AppIcon name="pin" class="mt-0.5 size-4 shrink-0" /> {{ site.address }}
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div v-for="col in columns" :key="col.title">
            <p class="font-display text-base font-semibold uppercase">{{ col.title }}</p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in col.links" :key="l.to">
                <NuxtLink :to="l.to" class="text-sm uppercase text-[#333] transition hover:text-cta">{{ l.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-wrap items-center gap-6 border-t border-[#d6d6d6] pt-8">
        <p class="font-display text-base font-semibold uppercase">Socials</p>
        <div class="flex gap-2">
          <a
            v-for="s in site.socials"
            :key="s.name"
            :href="s.href"
            target="_blank"
            rel="noopener"
            :aria-label="s.name"
            class="grid size-10 place-items-center bg-ink text-white transition hover:bg-cta"
          >
            <AppIcon :name="socialIcon[s.name] ?? 'arrow-right'" class="size-[18px]" />
          </a>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-4 text-xs uppercase text-[#555] md:flex-row md:items-center md:justify-between">
        <p>Copyright {{ year }} {{ companyName }}. All rights reserved.</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          <li v-for="l in legalLinks" :key="l.to">
            <NuxtLink :to="l.to" class="hover:text-cta">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
