<template>
  <div class="max-w-3xl mx-auto px-6 py-16 md:py-24 resume">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
          <span class="gradient-text">{{ resume.name }}</span>
        </h1>
        <p class="text-muted mt-1">{{ resume.title }} · {{ resume.location }}</p>
      </div>
      <button
        type="button"
        @click="print"
        class="no-print self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm text-muted hover:text-text hover:border-accent/50 rounded-lg transition-all duration-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.32 0H6.34m9.42-9V4.125c0-.621-.504-1.125-1.125-1.125h-5.25c-.621 0-1.125.504-1.125 1.125V9m9 0h-9" />
        </svg>
        Download / Print PDF
      </button>
    </header>

    <!-- Contact row -->
    <div class="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-muted">
      <a :href="`mailto:${resume.email}`" class="hover:text-accent transition-colors">{{ resume.email }}</a>
      <a :href="resume.website" class="hover:text-accent transition-colors">{{ resume.website.replace('https://', '') }}</a>
      <a :href="resume.github" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors">
        {{ resume.github.replace('https://', '') }}
      </a>
    </div>

    <!-- Summary -->
    <section class="mt-10">
      <h2 class="resume-h2">Summary</h2>
      <p class="text-muted leading-relaxed">{{ resume.summary }}</p>
    </section>

    <!-- Skills -->
    <section class="mt-8">
      <h2 class="resume-h2">Skills</h2>
      <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-3">
        <div v-for="s in resume.skills" :key="s.group" class="flex flex-col">
          <dt class="text-sm font-semibold text-text">{{ s.group }}</dt>
          <dd class="text-sm text-muted mt-0.5">{{ s.items.join(' · ') }}</dd>
        </div>
      </dl>
    </section>

    <!-- Experience (only if provided) -->
    <section v-if="resume.experience.length" class="mt-8">
      <h2 class="resume-h2">Experience</h2>
      <div v-for="(job, i) in resume.experience" :key="i" class="mb-5">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 class="font-semibold text-text">{{ job.role }} · <span class="text-accent">{{ job.company }}</span></h3>
          <span class="text-xs font-mono text-muted">{{ job.period }}</span>
        </div>
        <p v-if="job.location" class="text-xs text-muted">{{ job.location }}</p>
        <ul v-if="job.bullets?.length" class="list-disc list-inside mt-2 space-y-1 text-sm text-muted">
          <li v-for="(b, j) in job.bullets" :key="j">{{ b }}</li>
        </ul>
      </div>
    </section>

    <!-- Featured projects (from projects data) -->
    <section class="mt-8">
      <h2 class="resume-h2">Selected projects</h2>
      <div v-for="p in featured" :key="p.title" class="mb-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 class="font-semibold text-text">{{ p.title }}</h3>
          <span class="text-xs font-mono text-muted">{{ p.tech.slice(0, 4).join(' · ') }}</span>
        </div>
        <p class="text-sm text-muted mt-0.5 leading-relaxed">{{ p.description }}</p>
      </div>
    </section>

    <!-- Certifications -->
    <section class="mt-8">
      <h2 class="resume-h2">Certifications</h2>
      <ul class="space-y-1.5">
        <li v-for="c in topCerts" :key="c.credentialId || c.title" class="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
          <span class="text-text">{{ c.title }}</span>
          <span class="text-xs font-mono text-muted">{{ c.issuer }}<template v-if="c.length"> · {{ c.length }}</template></span>
        </li>
      </ul>
    </section>

    <!-- Education (only if provided) -->
    <section v-if="resume.education.length" class="mt-8">
      <h2 class="resume-h2">Education</h2>
      <div v-for="(e, i) in resume.education" :key="i" class="flex flex-wrap items-baseline justify-between gap-x-4 mb-1.5">
        <h3 class="font-semibold text-text">{{ e.credential }} · <span class="text-muted font-normal">{{ e.school }}</span></h3>
        <span class="text-xs font-mono text-muted">{{ e.period }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resume } from '../data/resume.js'
import { featuredProjects } from '../data/projects.js'
import { certifications } from '../data/certifications.js'
import { useSeo } from '../composables/useSeo.js'

useSeo({
  title: 'Résumé',
  description: 'Résumé of Ryan Dickinson — full-stack developer (Vue, Laravel, C++) based in Michigan.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Résumé', path: '/resume' },
  ],
})

const featured = featuredProjects
// Longest courses first, top 6.
const topCerts = computed(() =>
  [...certifications].sort((a, b) => (parseFloat(b.length) || 0) - (parseFloat(a.length) || 0)).slice(0, 6),
)

function print() {
  if (typeof window !== 'undefined') window.print()
}
</script>

<style scoped>
.resume-h2 {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
}

/* Print: white background, black text, drop nav/footer/buttons, tighten spacing. */
@media print {
  :global(nav),
  :global(footer),
  .no-print {
    display: none !important;
  }
  :global(body) {
    background: #fff !important;
    color: #000 !important;
  }
  .resume {
    padding: 0 !important;
    max-width: 100% !important;
  }
  .resume :deep(*) {
    color: #000 !important;
  }
  .resume-h2 {
    color: #444 !important;
  }
  .gradient-text {
    -webkit-text-fill-color: #000 !important;
    color: #000 !important;
  }
}
</style>
