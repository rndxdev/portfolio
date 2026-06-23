<template>
  <article class="gradient-border rounded-xl bg-surface p-6 flex flex-col gap-4 h-full">
    <div class="flex items-start gap-4">
      <!-- Decorative badge mark -->
      <div
        class="shrink-0 w-12 h-12 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
        </svg>
      </div>

      <div class="min-w-0">
        <h3 class="text-lg font-semibold text-text leading-snug">{{ cert.title }}</h3>
        <p class="text-sm text-muted mt-1">
          {{ cert.issuer }}<template v-if="cert.instructor"> · {{ cert.instructor }}</template>
        </p>
        <p v-if="cert.length" class="text-sm text-muted mt-0.5">{{ cert.length }}</p>
      </div>
    </div>

    <ul v-if="cert.skills?.length" class="flex flex-wrap gap-2" :aria-label="`Skills covered by ${cert.title}`">
      <li
        v-for="skill in cert.skills"
        :key="skill"
        class="text-xs font-mono px-2.5 py-1 rounded-full border border-cyan/30 text-cyan bg-cyan/10"
      >
        {{ skill }}
      </li>
    </ul>

    <div class="mt-auto pt-2 flex items-center justify-between gap-4">
      <p v-if="cert.credentialId" class="text-xs font-mono text-muted truncate">
        <span class="sr-only">Credential ID: </span>ID: {{ cert.credentialId }}
      </p>
      <a
        v-if="cert.url"
        :href="cert.url"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm font-medium text-accent hover:text-text hover:underline transition-colors duration-300"
        :aria-label="`Verify ${cert.title} credential (opens in new tab)`"
      >
        Verify credential
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  </article>
</template>

<script setup>
defineProps({
  cert: { type: Object, required: true },
})
</script>
