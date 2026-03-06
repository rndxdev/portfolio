<template>
  <div class="max-w-5xl mx-auto px-6 py-16 md:py-24">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">Projects</h1>
    <p class="text-muted mb-12 max-w-2xl">
      My open source journey is constantly growing, evolving, and shaping the way I build software.
    </p>
    <ProjectGrid :projects="projects" />
  </div>
</template>

<script setup>
import ProjectGrid from '../components/projects/ProjectGrid.vue'
import { projects } from '../data/projects.js'
</script>
