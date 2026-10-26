<script setup lang="ts">
import { formatDate, localDateFromToday, makeReference } from '~/utils/format'
import { type Region, dealers } from '~/data/dealers'
import { models } from '~/data/models'

useSeoMeta({
  title: 'Book a Service (PMS)',
  description: 'Book preventive maintenance or repairs at an authorized FAW-VW service center.',
})

const services = ['Preventive maintenance (PMS)', 'General repair / diagnosis', 'Tires, battery & brakes', 'Body & paint', 'Warranty concern', 'Other']
const slots = ['8:00 – 10:00 AM', '10:00 AM – 12:00 PM', '1:00 – 3:00 PM', '3:00 – 5:00 PM']
const form = reactive({
  model: '',
  plate: '',
  mileage: '',
  service: '',
  date: '',
  slot: '',
  region: '' as Region | '',
  dealer: '',
  notes: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  consent: false,
})
const minDate = ref('')
const formEl = ref<HTMLFormElement>()
const submitting = ref(false)
const reference = ref('')

onMounted(() => {
  minDate.value = localDateFromToday(1)
})

async function submit() {
  if (!formEl.value?.reportValidity()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  reference.value = makeReference('SV')
  submitting.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function reset() {
  Object.assign(form, { plate: '', mileage: '', service: '', date: '', slot: '', notes: '', consent: false })
  reference.value = ''
}

const summary = computed(() => [
  { label: 'Vehicle', value: `${models.find((m) => m.slug === form.model)?.name ?? ''} · ${form.plate.toUpperCase()}` },
  { label: 'Service', value: form.service },
  { label: 'Schedule', value: form.date ? `${formatDate(form.date)}, ${form.slot}` : '' },
  { label: 'Service center', value: dealers.find((d) => d.id === form.dealer)?.name ?? '' },
])
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Owners"
      title="Book a Service"
      intro="Keep your Volkswagen in top condition with factory-trained technicians and genuine parts."
      :crumbs="[{ label: 'Owners' }, { label: 'Book a Service' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div v-if="reference" class="mx-auto max-w-2xl">
        <FormSuccess
          title="Your service appointment is requested."
          message="Our service advisor will confirm your appointment. Please bring your OR/CR and service booklet."
          :reference="reference"
          :summary="summary"
          @reset="reset"
        />
      </div>

      <form v-else ref="formEl" class="grid gap-8 lg:grid-cols-[1fr_340px]" novalidate @submit.prevent="submit">
        <div class="card space-y-8 p-6 sm:p-8">
          <fieldset class="space-y-4">
            <legend class="font-display text-lg font-bold">1. Your vehicle</legend>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <label class="field-label" for="sv-model">Model *</label>
                <select id="sv-model" v-model="form.model" class="field-input" required>
                  <option value="" disabled>Select</option>
                  <option v-for="m in models" :key="m.slug" :value="m.slug">{{ m.name }}</option>
                </select>
              </div>
              <div>
                <label class="field-label" for="sv-plate">Plate number *</label>
                <input id="sv-plate" v-model.trim="form.plate" class="field-input uppercase" placeholder="ABC 1234" required>
              </div>
              <div>
                <label class="field-label" for="sv-mileage">Odometer (km) *</label>
                <input id="sv-mileage" v-model="form.mileage" type="number" min="0" inputmode="numeric" class="field-input" placeholder="10000" required>
              </div>
            </div>
            <div>
              <label class="field-label" for="sv-type">Service needed *</label>
              <select id="sv-type" v-model="form.service" class="field-input" required>
                <option value="" disabled>Select a service</option>
                <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </fieldset>

          <fieldset class="space-y-4 border-t border-slate-100 pt-8">
            <legend class="font-display text-lg font-bold">2. Schedule &amp; service center</legend>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="field-label" for="sv-date">Preferred date *</label>
                <input id="sv-date" v-model="form.date" type="date" class="field-input" :min="minDate" required>
              </div>
              <div>
                <label class="field-label" for="sv-slot">Preferred time *</label>
                <select id="sv-slot" v-model="form.slot" class="field-input" required>
                  <option value="" disabled>Select a time</option>
                  <option v-for="s in slots" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>
            <FormDealerSelect v-model:region="form.region" v-model:dealer="form.dealer" service="Service" />
            <div>
              <label class="field-label" for="sv-notes">Notes for the service advisor</label>
              <textarea id="sv-notes" v-model="form.notes" rows="3" class="field-input" placeholder="Describe any concern, noise or warning light" />
            </div>
          </fieldset>

          <fieldset class="space-y-4 border-t border-slate-100 pt-8">
            <legend class="font-display text-lg font-bold">3. Your details</legend>
            <FormContactFields
              v-model:firstName="form.firstName"
              v-model:lastName="form.lastName"
              v-model:email="form.email"
              v-model:mobile="form.mobile"
            />
            <FormConsentField v-model="form.consent" />
          </fieldset>

          <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Request appointment' }}
          </button>
        </div>

        <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div class="card p-6">
            <p class="font-display text-lg font-bold">Recommended PMS schedule</p>
            <ul class="mt-4 divide-y divide-slate-100 text-sm">
              <li class="flex justify-between py-2.5"><span class="text-slate-500">1,000 km</span><span class="font-medium">First check-up</span></li>
              <li class="flex justify-between py-2.5"><span class="text-slate-500">Every 10,000 km</span><span class="font-medium">Oil & filter, inspection</span></li>
              <li class="flex justify-between py-2.5"><span class="text-slate-500">Every 40,000 km</span><span class="font-medium">Major service</span></li>
            </ul>
            <p class="mt-3 text-xs text-slate-400">Or every 6 months, whichever comes first.</p>
          </div>
          <NuxtLink to="/owners/warranty" class="card flex items-center justify-between p-5 font-semibold transition hover:bg-mist">
            Warranty coverage <AppIcon name="arrow-right" class="size-4" />
          </NuxtLink>
          <NuxtLink to="/owners/faq" class="card flex items-center justify-between p-5 font-semibold transition hover:bg-mist">
            Owner FAQ <AppIcon name="arrow-right" class="size-4" />
          </NuxtLink>
        </aside>
      </form>
    </section>
  </div>
</template>
