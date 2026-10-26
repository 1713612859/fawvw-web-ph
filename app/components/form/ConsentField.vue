<script setup lang="ts">
const accepted = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
    <input v-model="accepted" type="checkbox" class="mt-1 size-4 shrink-0 accent-brand-900" required>
    <span>
      I agree that my personal data will be processed to respond to this request, in accordance with the
      <NuxtLink to="/privacy-notice" class="font-medium text-brand-700 underline underline-offset-2">Privacy Notice</NuxtLink>
      and the Data Privacy Act of 2012 (RA 10173). *
    </span>
  </label>
</template>
