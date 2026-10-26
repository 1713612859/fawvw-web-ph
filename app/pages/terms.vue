<script setup lang="ts">
import { companyName } from '~/data/site'

useSeoMeta({ title: 'Terms of Use', description: 'Terms governing the use of the FAW-VW Philippines website.' })

const sections = [
  {
    heading: 'Acceptance',
    paras: [`By using this website you agree to these Terms of Use. The website is operated by ${companyName}. If you do not agree, please do not use the site.`],
  },
  {
    heading: 'Product information and prices',
    paras: [
      'Vehicle images, specifications, features and colors shown are for illustration and may differ from models available in the Philippines. Prices are suggested retail prices, may vary by dealer and location, and are subject to change without prior notice.',
      'Please confirm all details with an authorized dealer before purchase.',
    ],
  },
  {
    heading: 'Intellectual property',
    paras: ['The Volkswagen and FAW-Volkswagen names, logos, images and content on this website are owned by their respective rights holders and may not be used without prior written permission.'],
  },
  {
    heading: 'Online requests',
    paras: ['Quote, test drive and service requests submitted through this website are not binding offers or reservations until confirmed by an authorized dealer.'],
  },
  {
    heading: 'Limitation of liability',
    paras: ['We make reasonable efforts to keep information accurate but do not warrant that the website is free of errors or interruptions. To the extent permitted by law, we are not liable for losses arising from use of the website.'],
  },
  {
    heading: 'Governing law',
    paras: ['These terms are governed by the laws of the Republic of the Philippines.'],
  },
]
</script>

<template>
  <LegalPage
    title="Terms of Use"
    intro="The rules for using this website."
    updated="October 1, 2026"
    :sections="sections"
  />
</template>
