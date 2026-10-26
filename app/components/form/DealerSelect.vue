<script setup lang="ts">
import { type Region, dealers, dealersIn, regions } from '~/data/dealers'

// Region → dealer cascade shared by the quote, test drive and service forms.
const region = defineModel<Region | ''>('region', { default: '' })
const dealer = defineModel<string>('dealer', { default: '' })
const props = withDefaults(defineProps<{ service?: 'Showroom' | 'Service' }>(), { service: 'Showroom' })

const options = computed(() => (region.value ? dealersIn(region.value).filter((d) => d.services.includes(props.service)) : []))

watch(region, () => {
  if (!options.value.some((d) => d.id === dealer.value)) dealer.value = ''
})

// Keep the region in sync when a dealer is preselected (e.g. from the dealer page).
onMounted(() => {
  const d = dealers.find((x) => x.id === dealer.value)
  if (d && !region.value) region.value = d.region
})
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label class="field-label" for="region">Region *</label>
      <select id="region" v-model="region" class="field-input" required>
        <option value="" disabled>Select a region</option>
        <option v-for="r in regions" :key="r.key" :value="r.key">{{ r.label }}</option>
      </select>
    </div>
    <div>
      <label class="field-label" for="dealer">Preferred dealer *</label>
      <select id="dealer" v-model="dealer" class="field-input" required :disabled="!region">
        <option value="" disabled>{{ region ? 'Select a dealer' : 'Select a region first' }}</option>
        <option v-for="d in options" :key="d.id" :value="d.id">{{ d.name }}</option>
      </select>
    </div>
  </div>
</template>
