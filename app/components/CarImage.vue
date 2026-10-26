<script setup lang="ts">
// Official model photo (transparent cut-out). If a photo is missing or fails to load,
// shows a plain "image coming soon" panel — never a drawn or generated car.
withDefaults(
  defineProps<{
    src?: string
    alt: string
    label?: boolean
    eager?: boolean
  }>(),
  { label: true, eager: false },
)

const failed = ref(false)
</script>

<template>
  <div class="relative h-full w-full">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      width="1580"
      height="580"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="h-full w-full object-contain"
      @error="failed = true"
    >
    <div
      v-else
      class="absolute inset-0 grid place-items-center border border-dashed border-current/25 opacity-60"
      role="img"
      :aria-label="`${alt}: image coming soon`"
    >
      <span v-if="label" class="text-[11px] font-medium uppercase tracking-[0.14em]">Image coming soon</span>
    </div>
  </div>
</template>
