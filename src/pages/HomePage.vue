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
import { useHead } from '@unhead/vue'
import { useSeo } from '../composables/useSeo.js'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PROFILES } from '../site.config.js'

const { posts } = usePosts()

useSeo()

// schema.org entity data — tells Google "this site IS the developer Ryan Dickinson".
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: SITE_NAME,
            url: SITE_URL,
            jobTitle: 'Full-Stack Developer',
            description: SITE_DESCRIPTION,
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'Michigan',
              addressCountry: 'US',
            },
            knowsAbout: ['Vue.js', 'Laravel', 'PHP', 'JavaScript', 'C++', 'PostgreSQL', 'Linux'],
            sameAs: Object.values(PROFILES),
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            author: { '@id': `${SITE_URL}/#person` },
          },
        ],
      }),
    },
  ],
})
</script>
