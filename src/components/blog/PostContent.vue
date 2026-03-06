<template>
  <article class="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-accent prose-a:underline prose-a:decoration-accent/30 hover:prose-a:decoration-accent prose-code:font-mono prose-pre:bg-surface prose-pre:border prose-pre:border-border" v-html="html" />
</template>

<script setup>
defineProps({
  html: { type: String, required: true },
})
</script>
