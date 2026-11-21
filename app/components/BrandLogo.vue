<script setup lang="ts">
// Official FAWCAR logo (eagle mark + wordmark, from the client's artwork; built by
// scripts/make-brand-assets.mjs) with the market name beside it.
// compact: hide the market name between lg and xl, where the desktop menu needs the room.
withDefaults(defineProps<{ light?: boolean; compact?: boolean }>(), { light: false, compact: false })
</script>

<template>
  <span class="flex items-center gap-3">
    <img
      :src="light ? '/images/brand/fawcar-logo-white.webp' : '/images/brand/fawcar-logo.webp'"
      alt="FAWCAR"
      width="652"
      height="120"
      class="h-7 w-auto lg:h-8"
    >
    <span
      class="border-l pl-3 text-[10px] font-bold uppercase leading-none tracking-[0.28em]"
      :class="[light ? 'border-white/30 text-white/70' : 'border-line text-ink/60', compact && 'lg:max-xl:hidden']"
    >Philippines</span>
  </span>
</template>
