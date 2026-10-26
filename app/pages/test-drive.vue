<script setup lang="ts">
import { formatDate, localDateFromToday, makeReference } from '~/utils/format'
import { type Region, dealers } from '~/data/dealers'
import { findModel, models } from '~/data/models'

useSeoMeta({
  title: 'Book a Test Drive',
  description: 'Schedule a test drive of any FAW-Volkswagen model at a showroom near you.',
})

const route = useRoute()
const form = reactive({
  model: '',
  date: '',
  slot: '',
  region: '' as Region | '',
  dealer: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  license: false,
  consent: false,
})
const minDate = ref('')
const submitting = ref(false)
const reference = ref('')
const formEl = ref<HTMLFormElement>()

const slots = ['9:00 – 11:00 AM', '11:00 AM – 1:00 PM', '1:00 – 3:00 PM', '3:00 – 5:00 PM']
const selected = computed(() => findModel(form.model))

onMounted(() => {
  minDate.value = localDateFromToday(1)
  const m =findModel(String(route.query.model ?? ''))
  if (m) form.model = m.slug
  const d = dealers.find((x) => x.id === route.query.dealer)
  if (d) {
    form.region = d.region
    form.dealer = d.id
  }
})

async function submit() {
  if (!formEl.value?.reportValidity()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  reference.value = makeReference('TD')
  submitting.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function reset() {
  Object.assign(form, { date: '', slot: '', firstName: '', lastName: '', email: '', mobile: '', license: false, consent: false })
  reference.value = ''
}

const summary = computed(() => [
  { label: 'Model', value: selected.value?.name ?? '' },
  { label: 'Date', value: form.date ? formatDate(form.date) : '' },
  { label: 'Time', value: form.slot },
  { label: 'Dealer', value: dealers.find((d) => d.id === form.dealer)?.name ?? '' },
])
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Book a Test Drive"
      intro="Pick a model, a date and your preferred showroom. We'll confirm your schedule by phone or Viber."
      :crumbs="[{ label: 'Book a Test Drive' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div v-if="reference" class="mx-auto max-w-2xl">
        <FormSuccess
          title="Your test drive request is booked."
          message="The showroom will confirm your schedule shortly. Please bring a valid driver's license on the day."
          :reference="reference"
          :summary="summary"
          @reset="reset"
        />
      </div>

      <form v-else ref="formEl" class="grid gap-8 lg:grid-cols-[1fr_360px]" novalidate @submit.prevent="submit">
        <div class="card space-y-8 p-6 sm:p-8">
          <fieldset class="space-y-4">
            <legend class="font-display text-lg font-bold">1. Choose your model</legend>
            <div>
              <label class="field-label" for="td-model">Model *</label>
              <select id="td-model" v-model="form.model" class="field-input" required>
                <option value="" disabled>Select a model</option>
                <option v-for="m in models" :key="m.slug" :value="m.slug">{{ m.name }}</option>
              </select>
            </div>
          </fieldset>

          <fieldset class="space-y-4 border-t border-slate-100 pt-8">
            <legend class="font-display text-lg font-bold">2. Date &amp; showroom</legend>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="field-label" for="td-date">Preferred date *</label>
                <input id="td-date" v-model="form.date" type="date" class="field-input" :min="minDate" required>
              </div>
              <div>
                <label class="field-label" for="td-slot">Preferred time *</label>
                <select id="td-slot" v-model="form.slot" class="field-input" required>
                  <option value="" disabled>Select a time</option>
                  <option v-for="s in slots" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>
            <FormDealerSelect v-model:region="form.region" v-model:dealer="form.dealer" />
          </fieldset>

          <fieldset class="space-y-4 border-t border-slate-100 pt-8">
            <legend class="font-display text-lg font-bold">3. Your details</legend>
            <FormContactFields
              v-model:firstName="form.firstName"
              v-model:lastName="form.lastName"
              v-model:email="form.email"
              v-model:mobile="form.mobile"
            />
            <label class="flex items-start gap-3 text-sm text-slate-600">
              <input v-model="form.license" type="checkbox" class="mt-1 size-4 shrink-0 accent-brand-900" required>
              <span>I have a valid driver's license and will bring it to the test drive. *</span>
            </label>
            <FormConsentField v-model="form.consent" />
          </fieldset>

          <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="submitting">
            {{ submitting ? 'Booking…' : 'Book my test drive' }}
          </button>
        </div>

        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="card overflow-hidden">
            <div class="aspect-[16/9] bg-gradient-to-b from-white to-slate-200/70 px-4">
              <CarImage v-if="selected" :src="selected.image" :alt="selected.name" :label="false" />
              <div v-else class="grid h-full place-items-center text-sm text-slate-400">Choose a model to see it here</div>
            </div>
            <div class="p-6">
              <p class="font-display text-xl font-bold">{{ selected?.name ?? 'Your test drive' }}</p>
              <ul class="mt-4 space-y-3 text-sm text-slate-600">
                <li class="flex gap-2.5"><AppIcon name="steering" class="size-5 shrink-0 text-brand-700" /> About 30 minutes behind the wheel, on city and highway roads</li>
                <li class="flex gap-2.5"><AppIcon name="shield" class="size-5 shrink-0 text-brand-700" /> A product specialist rides along to answer questions</li>
                <li class="flex gap-2.5"><AppIcon name="calculator" class="size-5 shrink-0 text-brand-700" /> Get a quote and financing options on the spot</li>
              </ul>
            </div>
          </div>
        </aside>
      </form>
    </section>
  </div>
</template>
