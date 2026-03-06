<template>
  <router-link :to="`/blog/${post.slug}`" :aria-label="`Read ${post.title}`" class="group block gradient-border p-6 rounded-xl bg-surface transition-all duration-300 hover:-translate-y-1">
    <time class="text-xs font-mono text-accent" :datetime="post.date.toISOString().split('T')[0]">{{ formatDate(post.date) }}</time>
    <h3 class="text-lg font-semibold mt-2 group-hover:text-text transition-colors duration-300">
      {{ post.title }}
    </h3>
    <p class="text-sm text-muted mt-2 leading-relaxed">{{ post.description }}</p>
    <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-4">
      <span
        v-for="(tag, i) in post.tags"
        :key="tag"
        class="text-xs font-mono px-2.5 py-1 rounded-full border transition-colors duration-300"
        :class="tagColor(i)"
      >
        {{ tag }}
      </span>
    </div>
    <span class="inline-flex items-center gap-1 mt-4 text-sm text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1" aria-hidden="true">
      Read more
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
    </span>
  </router-link>
</template>

<script setup>
defineProps({
  post: { type: Object, required: true },
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

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
