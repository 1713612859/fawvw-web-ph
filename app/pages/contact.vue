<script setup lang="ts">
import { makeReference } from '~/utils/format'
import { mapEmbedUrl } from '~/data/dealers'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Contact Us',
  description: 'Get in touch with FAW-VW Philippines by phone, e-mail, Messenger or Viber.',
})

const topics = ['Product inquiry', 'Sales & pricing', 'Service & maintenance', 'Parts & accessories', 'Fleet & corporate sales', 'Feedback', 'Other']
const form = reactive({ topic: '', message: '', firstName: '', lastName: '', email: '', mobile: '', consent: false })
const formEl = ref<HTMLFormElement>()
const submitting = ref(false)
const reference = ref('')

async function submit() {
  if (!formEl.value?.reportValidity()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 900))
  reference.value = makeReference('CT')
  submitting.value = false
}

function reset() {
  Object.assign(form, { topic: '', message: '', firstName: '', lastName: '', email: '', mobile: '', consent: false })
  reference.value = ''
}

const channels = [
  { icon: 'phone', label: 'Call our hotline', value: site.hotline, href: site.hotlineHref },
  { icon: 'mail', label: 'E-mail us', value: site.email, href: `mailto:${site.email}` },
  { icon: 'messenger', label: 'Chat on Messenger', value: 'Reply within minutes', href: site.messenger },
  { icon: 'viber', label: 'Chat on Viber', value: 'Reply within minutes', href: site.viber },
] as const
</script>

<template>
  <div>
    <PageHeader
      eyebrow="We're here to help"
      title="Contact Us"
      intro="Questions about a model, a promo or your vehicle's service? Reach us through any channel below."
      :crumbs="[{ label: 'Contact Us' }]"
    />

    <section class="container-x py-12 sm:py-16">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          v-for="c in channels"
          :key="c.label"
          :href="c.href"
          target="_blank"
          rel="noopener"
          class="card group flex items-center gap-4 p-5 transition hover:border-brand-700/30 hover:bg-mist"
        >
          <span class="grid size-11 shrink-0 place-items-center bg-brand-900/5 text-brand-700 group-hover:bg-brand-900 group-hover:text-white">
            <AppIcon :name="c.icon" class="size-5" />
          </span>
          <span class="min-w-0">
            <span class="block text-sm text-slate-500">{{ c.label }}</span>
            <span class="block truncate font-semibold text-ink">{{ c.value }}</span>
          </span>
        </a>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <FormSuccess
            v-if="reference"
            title="Message received. Salamat!"
            message="Our customer care team will get back to you within one business day."
            :reference="reference"
            :summary="[{ label: 'Topic', value: form.topic }, { label: 'Name', value: `${form.firstName} ${form.lastName}` }]"
            @reset="reset"
          />
          <form v-else ref="formEl" class="card space-y-6 p-6 sm:p-8" novalidate @submit.prevent="submit">
            <h2 class="font-display text-xl font-bold">Send us a message</h2>
            <div>
              <label class="field-label" for="topic">Topic *</label>
              <select id="topic" v-model="form.topic" class="field-input" required>
                <option value="" disabled>Select a topic</option>
                <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <FormContactFields
              v-model:firstName="form.firstName"
              v-model:lastName="form.lastName"
              v-model:email="form.email"
              v-model:mobile="form.mobile"
            />
            <div>
              <label class="field-label" for="message">Message *</label>
              <textarea id="message" v-model="form.message" rows="5" class="field-input" placeholder="How can we help?" required minlength="10" />
            </div>
            <FormConsentField v-model="form.consent" />
            <button type="submit" class="btn-primary" :disabled="submitting">{{ submitting ? 'Sending…' : 'Send message' }}</button>
          </form>
        </div>

        <aside class="space-y-4">
          <div class="card overflow-hidden">
            <iframe
              :src="mapEmbedUrl(site.address)"
              title="Head office map"
              class="h-64 w-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
            <div class="space-y-3 p-6 text-sm">
              <p class="font-display text-lg font-bold">Head office &amp; flagship showroom</p>
              <p class="flex gap-2.5 text-slate-600"><AppIcon name="pin" class="size-5 shrink-0 text-brand-700" /> {{ site.address }}</p>
              <p class="flex gap-2.5 text-slate-600"><AppIcon name="steering" class="size-5 shrink-0 text-brand-700" /> {{ site.hours }}</p>
            </div>
          </div>
          <NuxtLink to="/dealers" class="card flex items-center justify-between p-5 font-semibold transition hover:bg-mist">
            Find a dealer near you <AppIcon name="arrow-right" class="size-4" />
          </NuxtLink>
        </aside>
      </div>
    </section>
  </div>
</template>
