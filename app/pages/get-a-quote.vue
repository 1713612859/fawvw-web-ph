<script setup lang="ts">
import { teaserMonthly } from '~/utils/finance'
import { makeReference } from '~/utils/format'
import { type Region, dealers } from '~/data/dealers'
import { modelDetails } from '~/data/modelDetails'
import { findModel, formatPrice, models } from '~/data/models'

useSeoMeta({
  title: 'Get a Quote',
  description: 'Request a fast, customized price quote from your nearest FAW-VW dealer.',
})

const route = useRoute()
const steps = ['Vehicle', 'Dealer', 'Your details']
const step = ref(0)
const submitting = ref(false)
const reference = ref('')

const form = reactive({
  model: '',
  variant: 0,
  payment: 'financing',
  region: '' as Region | '',
  dealer: '',
  timeline: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  contactBy: 'Call',
  consent: false,
})

const selected = computed(() => findModel(form.model))
const variants = computed(() => (form.model ? modelDetails[form.model]?.variants ?? [] : []))
const variant = computed(() => variants.value[form.variant] ?? variants.value[0])
watch(() => form.model, () => {
  if (!variants.value[form.variant]) form.variant = 0
})

// Prefill from links like /get-a-quote?model=talagon&variant=1 (after mount, so the
// prerendered HTML and the first client render match).
onMounted(() => {
  const m = findModel(String(route.query.model ?? ''))
  if (m) form.model = m.slug
  const v = Number(route.query.variant)
  if (m && Number.isInteger(v) && modelDetails[m.slug]?.variants[v]) form.variant = v
  const d = dealers.find((x) => x.id === route.query.dealer)
  if (d) {
    form.region = d.region
    form.dealer = d.id
  }
})

const timelines = ['Within 30 days', '1–3 months', '3–6 months', '6–12 months', 'Just researching']
const payments = [
  { value: 'financing', label: 'Bank financing' },
  { value: 'cash', label: 'Cash' },
  { value: 'undecided', label: 'Not sure yet' },
]

const stepForm = ref<HTMLFormElement>()
const modelError = ref(false)

async function next() {
  if (step.value === 0 && !form.model) {
    modelError.value = true
    return
  }
  if (stepForm.value && !stepForm.value.reportValidity()) return
  if (step.value < steps.length - 1) {
    step.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  reference.value = makeReference('QT')
  submitting.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function reset() {
  Object.assign(form, { firstName: '', lastName: '', email: '', mobile: '', consent: false, timeline: '' })
  step.value = 0
  reference.value = ''
}

const summary = computed(() => [
  { label: 'Model', value: `${selected.value?.name ?? ''} ${variant.value?.name ?? ''}`.trim() },
  { label: 'Dealer', value: dealers.find((d) => d.id === form.dealer)?.name ?? '' },
  { label: 'Payment', value: payments.find((p) => p.value === form.payment)?.label ?? '' },
  { label: 'Contact', value: `${form.firstName} ${form.lastName} · ${form.mobile}` },
])
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Get a Quote"
      intro="Tell us what you're interested in and your preferred dealer will send a customized quote, usually within one business day."
      :crumbs="[{ label: 'Get a Quote' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div v-if="reference" class="mx-auto max-w-2xl">
        <FormSuccess
          title="Thank you! Your quote request is in."
          :message="`A product specialist from ${summary[1]?.value} will contact you by ${form.contactBy.toLowerCase()} shortly.`"
          :reference="reference"
          :summary="summary"
          @reset="reset"
        />
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <!-- Stepper -->
          <ol class="mb-8 flex items-center gap-3">
            <li v-for="(s, i) in steps" :key="s" class="flex flex-1 items-center gap-3">
              <span
                class="grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition"
                :class="i < step ? 'bg-brand-900 text-white' : i === step ? 'bg-brand-700 text-white ring-4 ring-brand-700/15' : 'bg-mist text-slate-400'"
              >
                <AppIcon v-if="i < step" name="check" class="size-4" />
                <span v-else>{{ i + 1 }}</span>
              </span>
              <span class="hidden text-sm font-medium sm:block" :class="i <= step ? 'text-ink' : 'text-slate-400'">{{ s }}</span>
              <span v-if="i < steps.length - 1" class="h-px flex-1 bg-slate-200" />
            </li>
          </ol>

          <form ref="stepForm" class="card p-6 sm:p-8" novalidate @submit.prevent="next">
            <!-- Step 1: vehicle -->
            <div v-if="step === 0" class="space-y-6">
              <div>
                <p class="field-label">Model of interest *</p>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <label
                    v-for="m in models"
                    :key="m.slug"
                    class="cursor-pointer border p-3 transition"
                    :class="form.model === m.slug ? 'border-brand-700 bg-brand-700/5 ring-2 ring-brand-700/15' : 'border-slate-200 hover:border-slate-300'"
                  >
                    <input v-model="form.model" type="radio" name="model" :value="m.slug" class="sr-only" @change="modelError = false">
                    <span class="block aspect-[79/29]"><CarImage :src="m.image" :alt="m.name" :label="false" /></span>
                    <span class="mt-2 block text-sm font-semibold">{{ m.name }}</span>
                    <span class="block text-xs text-slate-500">From {{ formatPrice(m.priceFrom) }}</span>
                  </label>
                </div>
                <p v-if="modelError" class="mt-2 text-sm text-rose-600">Please choose a model.</p>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="field-label" for="variant">Variant *</label>
                  <select id="variant" v-model.number="form.variant" class="field-input" :disabled="!form.model" required>
                    <option v-if="!form.model" :value="0" disabled>Choose a model first</option>
                    <option v-for="(v, i) in variants" :key="v.name" :value="i">{{ v.name }} – {{ formatPrice(v.price) }}</option>
                  </select>
                </div>
                <div>
                  <p class="field-label">Payment method *</p>
                  <div class="grid grid-cols-3 gap-2">
                    <label
                      v-for="p in payments"
                      :key="p.value"
                      class="cursor-pointer border px-2 py-3 text-center text-sm font-medium transition"
                      :class="form.payment === p.value ? 'border-brand-700 bg-brand-700/5 text-brand-900' : 'border-slate-300 text-slate-600 hover:border-slate-400'"
                    >
                      <input v-model="form.payment" type="radio" name="payment" :value="p.value" class="sr-only">
                      {{ p.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: dealer -->
            <div v-else-if="step === 1" class="space-y-6">
              <FormDealerSelect v-model:region="form.region" v-model:dealer="form.dealer" />
              <div>
                <label class="field-label" for="timeline">When are you planning to buy? *</label>
                <select id="timeline" v-model="form.timeline" class="field-input" required>
                  <option value="" disabled>Select a timeline</option>
                  <option v-for="t in timelines" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>

            <!-- Step 3: contact -->
            <div v-else class="space-y-6">
              <FormContactFields
                v-model:firstName="form.firstName"
                v-model:lastName="form.lastName"
                v-model:email="form.email"
                v-model:mobile="form.mobile"
              />
              <div>
                <p class="field-label">Preferred contact method</p>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="c in ['Call', 'SMS', 'Viber', 'E-mail']"
                    :key="c"
                    class="cursor-pointer border px-4 py-2 text-sm font-semibold transition"
                    :class="form.contactBy === c ? 'border-cta bg-cta text-white' : 'border-[#cfcfcf] bg-white text-ink'"
                  >
                    <input v-model="form.contactBy" type="radio" name="contactBy" :value="c" class="sr-only">{{ c }}
                  </label>
                </div>
              </div>
              <FormConsentField v-model="form.consent" />
            </div>

            <div class="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
              <button v-if="step > 0" type="button" class="btn-outline" @click="step--">
                <AppIcon name="chevron-left" class="size-4" /> Back
              </button>
              <span v-else />
              <button type="submit" class="btn-primary" :disabled="submitting">
                <template v-if="submitting">Sending…</template>
                <template v-else-if="step < steps.length - 1">Continue <AppIcon name="arrow-right" class="size-4" /></template>
                <template v-else>Request my quote</template>
              </button>
            </div>
          </form>
        </div>

        <!-- Summary -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="card overflow-hidden">
            <div class="aspect-[16/9] bg-gradient-to-b from-white to-slate-200/70 px-4">
              <CarImage v-if="selected" :src="selected.image" :alt="selected.name" :label="false" />
              <div v-else class="grid h-full place-items-center text-sm text-slate-400">Choose a model to see it here</div>
            </div>
            <div class="p-6">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Your selection</p>
              <p class="mt-2 font-display text-xl font-bold">{{ selected?.name ?? '—' }}</p>
              <p class="text-sm text-slate-500">{{ variant?.name ?? 'Variant' }}</p>
              <p v-if="variant" class="mt-4 text-2xl font-bold text-brand-900">{{ formatPrice(variant.price) }}*</p>
              <p v-if="variant" class="text-sm text-slate-500">or from {{ formatPrice(Math.round(teaserMonthly(variant.price))) }}/month*</p>
              <ul class="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
                <li class="flex gap-2"><AppIcon name="check" class="size-4 text-brand-700" /> No obligation, free of charge</li>
                <li class="flex gap-2"><AppIcon name="check" class="size-4 text-brand-700" /> Reply within one business day</li>
                <li class="flex gap-2"><AppIcon name="check" class="size-4 text-brand-700" /> Financing options included</li>
              </ul>
            </div>
          </div>
          <p class="mt-3 text-xs text-slate-400">*Suggested retail price. Monthly estimate assumes 20% down, 60 months, 8% p.a.</p>
        </aside>
      </div>
    </section>
  </div>
</template>
