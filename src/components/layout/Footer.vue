<template>
  <footer class="mt-24">
    <!-- Gradient divider -->
    <div class="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    <div class="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Ryan Dickinson
      </p>
      <SocialLinks />
    </div>
  </footer>
</template>

<script setup>
import SocialLinks from '../shared/SocialLinks.vue'
</script>
