<template>
  <article class="group gradient-border p-6 rounded-xl bg-surface transition-all duration-300 hover:-translate-y-1">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-semibold group-hover:text-text transition-colors duration-300">
        {{ project.title }}
      </h3>
      <div class="flex gap-3">
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-accent transition-colors duration-300 hover:scale-110 inline-block"
          :aria-label="`${project.title} on GitHub (opens in new tab)`"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a
          v-if="project.live"
          :href="project.live"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-emerald transition-colors duration-300 hover:scale-110 inline-block"
          :aria-label="`${project.title} live site (opens in new tab)`"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
        </a>
      </div>
    </div>
    <p class="text-sm text-muted leading-relaxed mb-4">{{ project.description }}</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(t, i) in project.tech"
        :key="t"
        class="text-xs font-mono px-2.5 py-1 rounded-full border transition-colors duration-300"
        :class="tagColor(i)"
      >
        {{ t }}
      </span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
})

const colors = [
  'border-accent/30 text-accent bg-accent/10',
  'border-emerald/30 text-emerald bg-emerald/10',
  'border-cyan/30 text-cyan bg-cyan/10',
  'border-amber/30 text-amber bg-amber/10',
]

function tagColor(index) {
  return colors[index % colors.length]
}
</script>
