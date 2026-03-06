<template>
  <section class="max-w-5xl mx-auto px-6 py-16" aria-label="Featured projects">
    <FadeInOnScroll>
      <h2 class="text-sm font-mono text-accent mb-8 flex items-center gap-2">
        <span class="inline-block w-8 h-px bg-gradient-to-r from-accent to-emerald" aria-hidden="true" />
        Featured Projects
      </h2>
      <div class="grid gap-6">
        <ProjectCard v-for="project in featuredProjects" :key="project.title" :project="project" />
      </div>
      <router-link to="/projects" aria-label="View all projects" class="inline-flex items-center gap-1 mt-8 text-sm text-accent hover:text-text hover:gap-2 transition-all duration-300">
        All projects
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </router-link>
    </FadeInOnScroll>
  </section>
</template>

<script setup>
import FadeInOnScroll from '../shared/FadeInOnScroll.vue'
import ProjectCard from '../projects/ProjectCard.vue'
import { featuredProjects } from '../../data/projects.js'
</script>
