<script setup lang="ts">
import { financeDefaults, monthlyPayment } from '~/utils/finance'
import { modelDetails } from '~/data/modelDetails'
import { findModel, formatPrice, models } from '~/data/models'

useSeoMeta({
  title: 'Financing Calculator',
  description: 'Estimate the down payment and monthly amortization for any FAW-Volkswagen model.',
})

const route = useRoute()
const model = ref(models[0]!.slug)
const variantIdx = ref(0)
const downPct = ref(financeDefaults.downPct)
const months = ref(financeDefaults.months)
const rate = ref(financeDefaults.rate)
const terms = [12, 24, 36, 48, 60]

onMounted(() => {
  const m = findModel(String(route.query.model ?? ''))
  if (m) model.value = m.slug
})

const variants = computed(() => modelDetails[model.value]?.variants ?? [])
watch(model, () => (variantIdx.value = 0))

const price = computed(() => variants.value[variantIdx.value]?.price ?? 0)
const down = computed(() => Math.round((price.value * downPct.value) / 100))
const financed = computed(() => price.value - down.value)
const monthly = computed(() => monthlyPayment(financed.value, Number(rate.value) || 0, months.value))
const totalInterest = computed(() => monthly.value * months.value - financed.value)
const selected = computed(() => findModel(model.value))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Shopping tools"
      title="Financing Calculator"
      intro="Estimate your down payment and monthly amortization. Final terms depend on the approval of our partner banks."
      :crumbs="[{ label: 'Financing Calculator' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div class="card space-y-8 p-6 sm:p-8">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="field-label" for="fin-model">Model</label>
              <select id="fin-model" v-model="model" class="field-input">
                <option v-for="m in models" :key="m.slug" :value="m.slug">{{ m.name }}</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="fin-variant">Variant</label>
              <select id="fin-variant" v-model.number="variantIdx" class="field-input">
                <option v-for="(v, i) in variants" :key="v.name" :value="i">{{ v.name }} – {{ formatPrice(v.price) }}</option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-baseline justify-between">
              <label class="field-label" for="fin-down">Down payment</label>
              <p class="text-sm font-semibold text-brand-900">{{ downPct }}% · {{ formatPrice(down) }}</p>
            </div>
            <input id="fin-down" v-model.number="downPct" type="range" min="20" max="80" step="5" class="w-full accent-brand-900">
            <div class="mt-1 flex justify-between text-xs text-slate-400"><span>20%</span><span>80%</span></div>
          </div>

          <div>
            <p class="field-label">Loan term</p>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="t in terms"
                :key="t"
                type="button"
                class="border py-3 text-sm font-semibold transition"
                :class="months === t ? 'border-brand-700 bg-brand-700/5 text-brand-900' : 'border-slate-300 text-slate-600 hover:border-slate-400'"
                :aria-pressed="months === t"
                @click="months = t"
              >
                {{ t }}<span class="hidden sm:inline"> mos</span>
              </button>
            </div>
          </div>

          <div class="sm:max-w-xs">
            <label class="field-label" for="fin-rate">Interest rate (% per year)</label>
            <input id="fin-rate" v-model.number="rate" type="number" min="0" max="30" step="0.25" class="field-input">
          </div>
        </div>

        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="notch overflow-hidden bg-carbon text-white">
            <div class="aspect-[16/8] bg-[radial-gradient(ellipse_at_50%_60%,#2b2f36,#121212_70%)] px-6 pt-4">
              <CarImage v-if="selected" :src="selected.image" :alt="selected.name" :label="false" />
            </div>
            <div class="p-6 sm:p-8">
              <p class="text-sm text-white/60">Estimated monthly amortization</p>
              <p class="mt-1 font-display text-4xl font-extrabold">{{ formatPrice(Math.round(monthly)) }}</p>
              <p class="text-sm text-white/60">for {{ months }} months</p>
              <dl class="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                <div class="flex justify-between"><dt class="text-white/60">Vehicle price (SRP)</dt><dd class="font-medium">{{ formatPrice(price) }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/60">Down payment ({{ downPct }}%)</dt><dd class="font-medium">{{ formatPrice(down) }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/60">Amount financed</dt><dd class="font-medium">{{ formatPrice(financed) }}</dd></div>
                <div class="flex justify-between"><dt class="text-white/60">Total interest</dt><dd class="font-medium">{{ formatPrice(Math.round(totalInterest)) }}</dd></div>
              </dl>
              <NuxtLink :to="`/get-a-quote?model=${model}&variant=${variantIdx}`" class="btn-light mt-8 w-full">
                Get an official quote <AppIcon name="arrow-right" class="size-4" />
              </NuxtLink>
            </div>
          </div>
          <p class="mt-3 text-xs leading-relaxed text-slate-400">
            For estimation only. Excludes chattel mortgage fees, insurance and registration. Actual rates and terms are subject to bank approval.
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>
