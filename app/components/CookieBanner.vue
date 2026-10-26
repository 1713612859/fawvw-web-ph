<script setup lang="ts">
// Defaults to "necessary only" until the visitor opts in (Data Privacy Act, RA 10173).
const KEY = 'cookie-consent'
const visible = ref(false)

onMounted(() => {
  try {
    visible.value = !localStorage.getItem(KEY)
  }
  catch {
    visible.value = true
  }
})

function choose(value: 'necessary' | 'all') {
  try {
    localStorage.setItem(KEY, value)
  }
  catch {}
  visible.value = false
}
</script>

<template>
  <Transition enter-from-class="opacity-0 translate-y-4" enter-active-class="transition duration-300" leave-active-class="transition duration-200" leave-to-class="opacity-0 translate-y-4">
    <div
      v-if="visible"
      class="fixed inset-x-3 bottom-3 z-50 bg-white p-5 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-200 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md"
      role="dialog"
      aria-label="Cookie preferences"
    >
      <p class="font-display text-lg font-bold text-ink">We value your privacy</p>
      <p class="mt-1.5 text-sm leading-relaxed text-slate-600">
        We use necessary cookies to run this site. With your consent we also use analytics and marketing cookies to improve your experience.
        <NuxtLink to="/cookie-policy" class="font-medium text-brand-700 underline underline-offset-2">Cookie Policy</NuxtLink>
      </p>
      <div class="mt-4 flex gap-2">
        <button type="button" class="btn-outline btn-sm flex-1" @click="choose('necessary')">
          Necessary only
        </button>
        <button type="button" class="btn-primary btn-sm flex-1" @click="choose('all')">
          Accept all
        </button>
      </div>
    </div>
  </Transition>
</template>
