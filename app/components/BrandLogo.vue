<script setup lang="ts">
// Text wordmark placeholder. Swap for the official logo artwork supplied by
// FAW-Volkswagen once usage is authorized (e.g. /images/brand/logo.svg).
withDefaults(defineProps<{ light?: boolean }>(), { light: false })
</script>

<template>
  <span class="flex flex-col leading-none" :class="light ? 'text-white' : 'text-ink'">
    <span class="font-display text-[24px] font-bold tracking-tight">FAW-VW</span>
    <span class="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.34em]" :class="light ? 'text-white/60' : 'text-cta'">Philippines</span>
  </span>
</template>
