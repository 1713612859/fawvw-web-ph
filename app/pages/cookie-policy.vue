<script setup lang="ts">
useSeoMeta({ title: 'Cookie Policy', description: 'How FAW-VW Philippines uses cookies and how you can manage them.' })

const sections = [
  {
    heading: 'What are cookies?',
    paras: ['Cookies are small text files stored on your device when you visit a website. They help the site work and help us understand how it is used.'],
  },
  {
    heading: 'Cookies we use',
    list: [
      'Strictly necessary: required for the website to function, such as remembering your cookie choice. Always active.',
      'Analytics: help us measure visits and improve pages (for example Google Analytics). Used only with your consent.',
      'Marketing: help us show relevant ads on other platforms (for example Meta and Google Ads). Used only with your consent.',
    ],
  },
  {
    heading: 'Managing your choice',
    paras: ['When you first visit, you can choose "Necessary only" or "Accept all". You can change your choice at any time by clearing this site\'s cookies and local storage in your browser, after which the banner will appear again.'],
  },
]
</script>

<template>
  <LegalPage
    title="Cookie Policy"
    intro="How we use cookies and how you can manage them."
    updated="October 1, 2026"
    :sections="sections"
  />
</template>
