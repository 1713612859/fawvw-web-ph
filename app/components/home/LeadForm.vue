<script setup lang="ts">
// "How can we help you?" lead form at the bottom of the home page, as on most carmaker sites:
// pick what you need (test drive, quote, information) and a model, leave your details and a
// dealer, and the dealer calls back. Not yet connected to the dealer system (demo confirmation).
// Offers the home page models only; every model can be picked on /get-a-quote and /test-drive.
import type { Region } from '~/data/dealers'
import { dealers } from '~/data/dealers'
import { homeModels } from '~/data/home'
import { findModel, powertrainLabel } from '~/data/models'
import { makeReference } from '~/utils/format'

const interests = [
  { value: 'test-drive', label: 'Book a test drive', button: 'Book my test drive', prefix: 'TD' },
  { value: 'quote', label: 'Get a quote', button: 'Request my quote', prefix: 'QT' },
  { value: 'info', label: 'More information', button: 'Send my request', prefix: 'IN' },
] as const
type Interest = (typeof interests)[number]['value']

const form = reactive({
  interest: 'test-drive' as Interest,
  model: homeModels[0]!.slug,
  region: '' as Region | '',
  dealer: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  consent: false,
})
const selected = computed(() => findModel(form.model)!)
const interest = computed(() => interests.find((i) => i.value === form.interest)!)

const formEl = ref<HTMLFormElement>()
const submitting = ref(false)
const reference = ref('')

async function submit() {
  if (!formEl.value?.reportValidity()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  reference.value = makeReference(interest.value.prefix)
  submitting.value = false
}

function reset() {
  Object.assign(form, { consent: false })
  reference.value = ''
}

const dealerName = computed(() => dealers.find((d) => d.id === form.dealer)?.name ?? '')
const summary = computed(() => [
  { label: 'Request', value: interest.value.label },
  { label: 'Model', value: selected.value.name },
  { label: 'Dealer', value: dealerName.value },
  { label: 'Contact', value: `${form.firstName} ${form.lastName} · ${form.mobile}` },
])
</script>

<template>
  <section id="contact" class="scroll-mt-24 bg-mist py-16 sm:py-24" aria-labelledby="lead-title">
    <div class="container-x">
      <div class="max-w-2xl">
        <p class="eyebrow">Contact us</p>
        <h2 id="lead-title" class="h-section mt-3">How can we help you?</h2>
        <p class="mt-3 text-[#444]">Choose a model and leave your details: a FAWCAR dealer will contact you.</p>
      </div>

      <div v-if="reference" class="mx-auto mt-10 max-w-2xl">
        <FormSuccess
          title="Thank you! Your request is in."
          :message="`${dealerName} will contact you by phone shortly.${form.interest === 'test-drive' ? ' The test drive vehicle is confirmed by the dealer.' : ''}`"
          :reference="reference"
          :summary="summary"
          @reset="reset"
        />
      </div>

      <form v-else ref="formEl" class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12" novalidate @submit.prevent="submit">
        <div>
          <fieldset>
            <legend class="field-label">I would like to</legend>
            <div class="grid grid-cols-3 border border-line bg-white">
              <label
                v-for="i in interests"
                :key="i.value"
                class="flex cursor-pointer items-center justify-center px-2 py-3 text-center text-xs font-bold uppercase leading-tight transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta sm:text-sm"
                :class="form.interest === i.value ? 'bg-cta text-white' : 'text-ink hover:bg-mist'"
              >
                <input v-model="form.interest" type="radio" name="lead-interest" :value="i.value" class="sr-only">
                {{ i.label }}
              </label>
            </div>
          </fieldset>

          <div class="mt-6 bg-gradient-to-b from-white to-slate-200/70 px-6 pt-4">
            <div class="aspect-[2/1]">
              <CarImage :key="selected.slug" :src="selected.image" :alt="selected.name" :label="false" />
            </div>
          </div>
          <p class="mt-4 font-display text-2xl font-bold">{{ selected.name }}</p>
          <p class="text-sm text-slate-500">{{ selected.body }} · {{ powertrainLabel(selected) }}</p>

          <fieldset class="mt-5">
            <legend class="field-label">Model *</legend>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="m in homeModels"
                :key="m.slug"
                class="flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta"
                :class="form.model === m.slug ? 'border-cta bg-white text-cta' : 'border-line bg-white text-ink hover:border-slate-400'"
              >
                <input v-model="form.model" type="radio" name="lead-model" :value="m.slug" class="size-3.5 accent-[var(--color-cta)]" required>
                {{ m.name }}
              </label>
            </div>
          </fieldset>
        </div>

        <div class="card space-y-6 bg-white p-6 sm:p-8">
          <FormContactFields
            v-model:firstName="form.firstName"
            v-model:lastName="form.lastName"
            v-model:email="form.email"
            v-model:mobile="form.mobile"
          />
          <FormDealerSelect v-model:region="form.region" v-model:dealer="form.dealer" />
          <FormConsentField v-model="form.consent" />
          <button type="submit" class="btn-primary w-full" :disabled="submitting">
            {{ submitting ? 'Sending…' : interest.button }}
          </button>
          <p class="text-xs leading-relaxed text-slate-500">
            A dealer will contact you to confirm your request. Prices, availability and the test drive vehicle are confirmed by the dealer.
          </p>
        </div>
      </form>
    </div>
  </section>
</template>
