<script setup lang="ts">
// Name / e-mail / mobile block shared by all lead forms.
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })
const email = defineModel<string>('email', { default: '' })
const mobile = defineModel<string>('mobile', { default: '' })
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label class="field-label" for="first-name">First name *</label>
      <input id="first-name" v-model.trim="firstName" class="field-input" autocomplete="given-name" required>
    </div>
    <div>
      <label class="field-label" for="last-name">Last name *</label>
      <input id="last-name" v-model.trim="lastName" class="field-input" autocomplete="family-name" required>
    </div>
    <div>
      <label class="field-label" for="email">E-mail *</label>
      <input id="email" v-model.trim="email" type="email" class="field-input" autocomplete="email" placeholder="name@email.com" required>
    </div>
    <div>
      <label class="field-label" for="mobile">Mobile number *</label>
      <input
        id="mobile"
        v-model.trim="mobile"
        type="tel"
        class="field-input"
        autocomplete="tel"
        placeholder="0917 123 4567"
        pattern="^(\+?63|0)\s?9\d{2}[\s\-]?\d{3}[\s\-]?\d{4}$"
        title="Enter a Philippine mobile number, e.g. 0917 123 4567"
        required
      >
    </div>
  </div>
</template>
