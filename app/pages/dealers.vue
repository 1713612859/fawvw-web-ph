<script setup lang="ts">
import { type DealerService, type Region, dealers, directionsUrl, mapEmbedUrl, regions } from '~/data/dealers'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Find a Dealer',
  description: 'Find an authorized FAWCAR dealer in the Philippines: showrooms in Metro Manila, Pampanga and Bulacan.',
})

const serviceLabels: Record<DealerService, string> = { Showroom: 'Showroom (sales)', Service: 'Service center', Parts: 'Parts' }
// The service filter only appears once dealers offer more than one kind of service.
const serviceOptions = (Object.keys(serviceLabels) as DealerService[]).filter((s) => dealers.some((d) => d.services.includes(s)))

const region = ref<Region | ''>('')
const service = ref<DealerService | ''>('')
const list = computed(() =>
  dealers.filter((d) => (!region.value || d.region === region.value) && (!service.value || d.services.includes(service.value))),
)
const selectedId = ref(dealers[0]!.id)
const selected = computed(() => list.value.find((d) => d.id === selectedId.value) ?? list.value[0])

watch(list, (l) => {
  if (l.length && !l.some((d) => d.id === selectedId.value)) selectedId.value = l[0]!.id
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Dealer network"
      title="Find a Dealer"
      intro="Authorized FAWCAR retailers in the Philippines, as listed on fawcar.com. More locations to follow."
      :crumbs="[{ label: 'Find a Dealer' }]"
    />

    <section class="container-x py-10 sm:py-14">
      <div class="flex flex-col gap-3 sm:flex-row">
        <select v-model="region" class="field-input sm:max-w-xs" aria-label="Filter by region">
          <option value="">All regions</option>
          <option v-for="r in regions" :key="r.key" :value="r.key">{{ r.label }}</option>
        </select>
        <select v-if="serviceOptions.length > 1" v-model="service" class="field-input sm:max-w-xs" aria-label="Filter by service">
          <option value="">All services</option>
          <option v-for="s in serviceOptions" :key="s" :value="s">{{ serviceLabels[s] }}</option>
        </select>
        <p class="self-center text-sm text-slate-500 sm:ml-auto">{{ list.length }} {{ list.length === 1 ? 'location' : 'locations' }}</p>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ul class="space-y-3">
          <li v-for="d in list" :key="d.id">
            <div
              class="card cursor-pointer p-5 transition"
              :class="selected?.id === d.id ? 'border-brand-700/40 ring-2 ring-brand-700/15' : 'hover:border-slate-200'"
              role="button"
              tabindex="0"
              :aria-pressed="selected?.id === d.id"
              @click="selectedId = d.id"
              @keydown.enter="selectedId = d.id"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="font-display text-lg font-bold">{{ d.name }}</h2>
                  <p class="mt-1 flex gap-2 text-sm text-slate-600"><AppIcon name="pin" class="mt-0.5 size-4 shrink-0 text-brand-700" /> {{ d.address }}</p>
                </div>
                <div class="flex shrink-0 flex-wrap justify-end gap-1">
                  <span v-for="s in d.services" :key="s" class="bg-[#ececec] px-2 py-1 text-[11px] font-bold uppercase text-ink">{{ s }}</span>
                </div>
              </div>
              <p v-if="d.note" class="mt-1 pl-6 text-sm text-slate-500">{{ d.note }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ d.hours }}</p>
              <p v-if="!d.phone" class="mt-1 text-sm text-slate-500">
                Phone to be confirmed. Call our hotline <a :href="site.hotlineHref" class="font-semibold text-cta">{{ site.hotline }}</a>
              </p>
              <div class="mt-4 flex flex-wrap gap-2" @click.stop>
                <a :href="directionsUrl(d.address)" target="_blank" rel="noopener" class="btn-outline !px-4 !py-2">Directions</a>
                <a v-if="d.phone" :href="`tel:${d.phone.replace(/\s/g, '')}`" class="btn-outline !px-4 !py-2"><AppIcon name="phone" class="size-4" /> Call</a>
                <NuxtLink :to="`/test-drive?dealer=${d.id}`" class="btn-primary !px-4 !py-2">Book a test drive</NuxtLink>
              </div>
            </div>
          </li>
          <li v-if="!list.length" class="card p-8 text-center text-slate-500">No locations match these filters yet.</li>
        </ul>

        <div v-if="selected" class="lg:sticky lg:top-24 lg:self-start">
          <div class="card overflow-hidden">
            <iframe
              :key="selected.id"
              :src="mapEmbedUrl(selected.address)"
              :title="`Map of ${selected.name}`"
              class="h-[320px] w-full border-0 sm:h-[460px]"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
            <div class="flex items-center justify-between gap-4 p-5">
              <div>
                <p class="font-semibold">{{ selected.name }}</p>
                <p class="text-sm text-slate-500">{{ selected.city }}</p>
              </div>
              <NuxtLink :to="`/get-a-quote?dealer=${selected.id}`" class="btn-primary shrink-0 !px-4 !py-2">Get a Quote</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
