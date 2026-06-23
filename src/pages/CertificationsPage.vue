<template>
  <div class="max-w-5xl mx-auto px-6 py-16 md:py-24">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
      <span class="gradient-text">Certifications</span>
    </h1>
    <p class="text-muted mb-12 max-w-2xl">
      Coursework and credentials I've earned along the way. Each one links to a verifiable record.
    </p>

    <ul
      v-if="certifications.length"
      class="grid gap-6 sm:grid-cols-2"
      aria-label="List of certifications"
    >
      <li v-for="cert in certifications" :key="cert.credentialId || cert.title">
        <CertCard :cert="cert" />
      </li>
    </ul>

    <p v-else class="text-muted">No certifications to show yet — check back soon.</p>
  </div>
</template>

<script setup>
import CertCard from '../components/certifications/CertCard.vue'
import { certifications } from '../data/certifications.js'
</script>
