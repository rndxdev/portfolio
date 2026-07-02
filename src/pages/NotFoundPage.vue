<template>
  <section
    class="relative max-w-3xl mx-auto px-6 py-24 md:py-32 text-center overflow-hidden"
    aria-labelledby="notfound-heading"
  >
    <!-- Background glow orbs -->
    <div
      class="absolute top-0 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[120px] animate-float"
      aria-hidden="true"
    />
    <div
      class="absolute bottom-0 -right-24 w-56 h-56 bg-rose/10 rounded-full blur-[100px] animate-float"
      style="animation-delay: 1.5s"
      aria-hidden="true"
    />

    <p class="font-mono text-sm text-accent mb-4 animate-fade-up">Error 404</p>
    <h1
      id="notfound-heading"
      class="text-7xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-up animate-delay-1"
    >
      <span class="gradient-text">404</span>
    </h1>

    <p class="text-lg text-muted max-w-md mx-auto leading-relaxed animate-fade-up animate-delay-2">
      This page wandered off the trail. The link may be broken, or the page may have moved.
    </p>

    <!-- Mono terminal-style hint -->
    <p
      class="mt-6 inline-block font-mono text-sm text-muted bg-surface border border-border rounded-lg px-4 py-2 animate-fade-up animate-delay-3"
    >
      <span class="text-rose" aria-hidden="true">$</span>
      cd <span class="text-text">{{ attemptedPath }}</span>
      <span class="text-muted"> → no such file or directory</span>
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up animate-delay-4">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg text-sm font-medium rounded-lg hover:bg-accent-hover transition-all duration-300 glow-accent hover:scale-105"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Back home
      </router-link>
      <router-link
        to="/projects"
        class="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm text-muted hover:text-text hover:border-accent/50 transition-all duration-300 rounded-lg hover:scale-105"
      >
        View projects
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useSeo } from '../composables/useSeo.js'

const route = useRoute()
const attemptedPath = route.fullPath

useSeo({ title: 'Page not found' })
useHead({ meta: [{ name: 'robots', content: 'noindex' }] })
</script>
