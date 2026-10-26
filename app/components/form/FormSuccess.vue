<script setup lang="ts">
defineProps<{
  title: string
  message: string
  reference: string
  summary: { label: string; value: string }[]
}>()
defineEmits<{ reset: [] }>()
</script>

<template>
  <div class="card p-6 text-center sm:p-10" role="status">
    <span class="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
      <AppIcon name="check" class="size-7" />
    </span>
    <h2 class="mt-5 font-display text-2xl font-bold text-ink">{{ title }}</h2>
    <p class="mx-auto mt-2 max-w-md text-slate-600">{{ message }}</p>
    <p class="mt-4 text-sm text-slate-500">Reference no. <span class="font-semibold text-ink">{{ reference }}</span></p>

    <dl class="mx-auto mt-6 max-w-md divide-y divide-slate-100 bg-mist px-5 text-left text-sm">
      <div v-for="s in summary" :key="s.label" class="flex justify-between gap-4 py-3">
        <dt class="text-slate-500">{{ s.label }}</dt>
        <dd class="text-right font-medium text-ink">{{ s.value }}</dd>
      </div>
    </dl>

    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <NuxtLink to="/" class="btn-primary">Back to home</NuxtLink>
      <button type="button" class="btn-outline" @click="$emit('reset')">Submit another request</button>
    </div>
    <p class="mt-6 text-xs text-slate-400">Demo site: this form is not yet connected to the dealer system.</p>
  </div>
</template>
