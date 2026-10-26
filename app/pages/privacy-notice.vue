<script setup lang="ts">
import { companyName } from '~/data/site'

useSeoMeta({ title: 'Privacy Notice', description: 'How FAW-VW Philippines collects, uses and protects your personal data under the Data Privacy Act of 2012.' })

const sections = [
  {
    heading: 'Who we are',
    paras: [`${companyName} ("we", "us") respects your privacy and processes personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and issuances of the National Privacy Commission.`],
  },
  {
    heading: 'What we collect',
    list: [
      'Contact details: name, e-mail address, mobile number',
      'Inquiry details: model of interest, preferred dealer, purchase timeline, appointment dates',
      'Vehicle details for service bookings: model, plate number, odometer reading',
      'Technical data: device and browser information, and cookies where you have consented',
    ],
  },
  {
    heading: 'Why we use it',
    list: [
      'To respond to quote, test drive, service and contact requests',
      'To forward your request to the dealer you selected',
      'To send updates and offers, only if you have opted in',
      'To improve our website and services',
    ],
  },
  {
    heading: 'Sharing',
    paras: ['We share your data only with our authorized dealers and service providers who process it on our behalf under data sharing or outsourcing agreements, or when required by law. We do not sell your personal data.'],
  },
  {
    heading: 'Retention and security',
    paras: ['We keep personal data only as long as necessary for the purposes above or as required by law, and protect it with organizational, physical and technical security measures.'],
  },
  {
    heading: 'Your rights',
    paras: ['As a data subject you have the right to be informed, to access, to object, to erasure or blocking, to rectification, to data portability, to damages, and to file a complaint with the National Privacy Commission. To exercise these rights, contact our Data Protection Officer using the details below.'],
  },
]
</script>

<template>
  <LegalPage
    title="Privacy Notice"
    intro="How we collect, use and protect your personal data."
    updated="October 1, 2026"
    :sections="sections"
  />
</template>
