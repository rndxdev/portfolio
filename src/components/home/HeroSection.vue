<template>
  <section class="relative max-w-5xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    aria-label="Introduction">
    <!-- Background glow orbs -->
    <div class="absolute top-10 -left-32 w-72 h-72 bg-accent/10 rounded-full blur-[120px] animate-float"
      aria-hidden="true" />
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-emerald/10 rounded-full blur-[100px] animate-float"
      style="animation-delay: 1.5s" aria-hidden="true" />

    <p class="font-mono text-sm text-accent mb-4 animate-fade-up">Hi, I'm</p>
    <h1 class="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 animate-fade-up animate-delay-1">
      <span class="gradient-text">Ryan Dickinson</span>
    </h1>
    <p class="text-lg md:text-xl text-muted max-w-2xl leading-relaxed animate-fade-up animate-delay-2">
      I build software that connects people and enjoy the challenge of creating thoughtful, practical solutions. I’m a
      full-stack developer who enjoys open source tools, the outdoors, and solving real-world problems with technology.
    </p>
    <div class="mt-8 flex flex-wrap gap-4 animate-fade-up animate-delay-3">
      <router-link to="/projects"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg text-sm font-medium rounded-lg hover:bg-accent-hover transition-all duration-300 glow-accent hover:scale-105">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        View Projects
      </router-link>
      <router-link to="/about"
        class="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm text-muted hover:text-text hover:border-accent/50 transition-all duration-300 rounded-lg hover:scale-105">
        About Me
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </router-link>
    </div>

    <!-- Status indicator -->
    <div class="mt-12 flex items-center gap-3 animate-fade-up animate-delay-4">
      <span class="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald"></span>
      </span>
      <span class="text-sm text-muted">Available for collaboration</span>
    </div>
  </section>
</template>
