<template>
  <nav class="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border" aria-label="Main navigation">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="font-mono text-sm font-semibold gradient-text hover:opacity-80 transition-opacity">
        rndx.dev
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="relative text-sm text-muted hover:text-text transition-colors duration-300 py-1"
          active-class="nav-active"
        >
          {{ link.label }}
        </router-link>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden text-muted hover:text-text transition-colors"
        @click="mobileOpen = !mobileOpen"
        aria-label="Toggle menu"
        :aria-expanded="mobileOpen"
      >
        <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="slide">
      <div v-if="mobileOpen" class="md:hidden border-t border-border bg-bg/95 backdrop-blur-md">
        <div class="px-6 py-4 flex flex-col gap-4">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm text-muted hover:text-text transition-colors"
            active-class="text-accent!"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)
const links = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]
</script>

<style scoped>
.nav-active {
  color: var(--color-text);
}
.nav-active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-cyan));
  border-radius: 1px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
