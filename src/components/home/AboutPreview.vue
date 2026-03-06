<template>
  <section class="max-w-5xl mx-auto px-6 py-16" aria-label="About preview">
    <FadeInOnScroll>
      <h2 class="text-sm font-mono text-accent mb-6 flex items-center gap-2">
        <span class="inline-block w-8 h-px bg-gradient-to-r from-accent to-cyan" aria-hidden="true" />
        About
      </h2>
      <p class="text-lg text-muted leading-relaxed max-w-3xl">
        I’m a developer who likes building things that matter. When I’m not writing code, I’m usually on the water or
        somewhere in the woods. I care about open source, clean code, and creating tools that solve real problems.
      </p>
      <router-link to="/about" aria-label="Read more about me"
        class="inline-flex items-center gap-1 mt-6 text-sm text-accent hover:text-text hover:gap-2 transition-all duration-300">
        Read more
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </router-link>
    </FadeInOnScroll>
  </section>
</template>

<script setup>
import FadeInOnScroll from '../shared/FadeInOnScroll.vue'
</script>
