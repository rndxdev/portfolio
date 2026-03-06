<template>
  <div class="grid gap-6 md:grid-cols-2">
    <ProjectCard v-for="project in projects" :key="project.title" :project="project" />
  </div>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: { type: Array, required: true },
})
</script>
