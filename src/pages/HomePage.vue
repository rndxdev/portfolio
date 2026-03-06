<template>
  <div>
    <HeroSection />
    <AboutPreview />
    <FeaturedProjects />

    <section v-if="posts.length" class="max-w-5xl mx-auto px-6 py-16" aria-label="Latest blog posts">
      <FadeInOnScroll>
        <h2 class="text-sm font-mono text-accent mb-8 flex items-center gap-2">
          <span class="inline-block w-8 h-px bg-gradient-to-r from-accent to-amber" aria-hidden="true" />
          Latest Posts
        </h2>
        <PostList :posts="posts.slice(0, 3)" />
        <router-link to="/blog" aria-label="View all blog posts" class="inline-flex items-center gap-1 mt-8 text-sm text-accent hover:text-text hover:gap-2 transition-all duration-300">
          All posts
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </router-link>
      </FadeInOnScroll>
    </section>
  </div>
</template>

<script setup>
import HeroSection from '../components/home/HeroSection.vue'
import AboutPreview from '../components/home/AboutPreview.vue'
import FeaturedProjects from '../components/home/FeaturedProjects.vue'
import FadeInOnScroll from '../components/shared/FadeInOnScroll.vue'
import PostList from '../components/blog/PostList.vue'
import { usePosts } from '../composables/usePosts.js'

const { posts } = usePosts()
</script>
