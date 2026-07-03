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
        <button
          type="button"
          @click="palette.open()"
          aria-label="Open command palette"
          aria-keyshortcuts="Meta+K Control+K"
          class="flex items-center gap-2 text-xs text-muted hover:text-text border border-border hover:border-accent/50 rounded-lg px-2.5 py-1.5 transition-colors duration-300"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <kbd class="font-mono">⌘K</kbd>
        </button>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-text transition-colors"
        @click="mobileOpen = !mobileOpen"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
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
      <div v-if="mobileOpen" id="mobile-menu" class="md:hidden border-t border-border bg-bg/95 backdrop-blur-md">
        <div class="px-6 py-2 flex flex-col">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm text-muted hover:text-text transition-colors flex items-center min-h-[44px]"
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
import { useCommandPalette } from '../../composables/useCommandPalette.js'

const palette = useCommandPalette()
const mobileOpen = ref(false)
const links = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/certifications', label: 'Certs' },
  { to: '/resume', label: 'Résumé' },
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
