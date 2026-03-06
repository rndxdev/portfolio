<template>
  <div class="max-w-4xl mx-auto px-6 py-16 md:py-24">
    <header class="mb-16">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4" id="blog-heading">
        <span class="gradient-text">Blog</span>
      </h1>
      <p class="text-muted text-lg max-w-xl">
        Writing about code, open source, and building things that matter.
      </p>
    </header>

    <!-- Tag filter -->
    <div v-if="allTags.length" class="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter posts by tag">
      <button
        @click="activeTag = null"
        :aria-pressed="activeTag === null"
        class="text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200"
        :class="activeTag === null ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent/40 hover:text-text'"
      >
        All
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="activeTag = activeTag === tag ? null : tag"
        :aria-pressed="activeTag === tag"
        class="text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200"
        :class="activeTag === tag ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent/40 hover:text-text'"
      >
        {{ tag }}
      </button>
    </div>

    <template v-if="filteredPosts.length">
      <!-- Featured / latest post -->
      <FadeInOnScroll>
        <router-link
          :to="`/blog/${filteredPosts[0].slug}`"
          :aria-label="`Read ${filteredPosts[0].title}`"
          class="group block gradient-border rounded-xl bg-surface p-8 md:p-10 mb-10 transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent">Latest</span>
            <time class="text-xs font-mono text-muted" :datetime="filteredPosts[0].date.toISOString().split('T')[0]">{{ formatDate(filteredPosts[0].date) }}</time>
            <span class="text-xs text-muted" aria-label="estimated reading time">{{ readTime(filteredPosts[0].content) }}</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-accent transition-colors duration-300">
            {{ filteredPosts[0].title }}
          </h2>
          <p class="text-muted mt-3 text-base leading-relaxed max-w-2xl">{{ filteredPosts[0].description }}</p>
          <div v-if="filteredPosts[0].tags.length" class="flex flex-wrap gap-2 mt-5">
            <span
              v-for="(tag, i) in filteredPosts[0].tags"
              :key="tag"
              class="text-xs font-mono px-2.5 py-1 rounded-full border"
              :class="tagColor(i)"
            >
              {{ tag }}
            </span>
          </div>
          <span class="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1" aria-hidden="true">
            Read article
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </router-link>
      </FadeInOnScroll>

      <!-- Remaining posts -->
      <div v-if="filteredPosts.length > 1" class="space-y-1">
        <FadeInOnScroll v-for="post in filteredPosts.slice(1)" :key="post.slug">
          <router-link
            :to="`/blog/${post.slug}`"
            :aria-label="`Read ${post.title}`"
            class="group flex items-start gap-6 py-6 border-b border-border/50 transition-colors duration-200 hover:border-accent/30"
          >
            <time class="text-xs font-mono text-muted whitespace-nowrap pt-1.5 hidden sm:block min-w-[7rem]" :datetime="post.date.toISOString().split('T')[0]">{{ formatDate(post.date) }}</time>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1 sm:hidden">
                <time class="text-xs font-mono text-muted" :datetime="post.date.toISOString().split('T')[0]">{{ formatDate(post.date) }}</time>
                <span class="text-xs text-muted">{{ readTime(post.content) }}</span>
              </div>
              <h3 class="text-lg font-semibold group-hover:text-accent transition-colors duration-200 leading-snug">
                {{ post.title }}
              </h3>
              <p class="text-sm text-muted mt-1.5 leading-relaxed line-clamp-2">{{ post.description }}</p>
              <div class="flex items-center gap-3 mt-3">
                <div v-if="post.tags.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(tag, i) in post.tags"
                    :key="tag"
                    class="text-[11px] font-mono px-2 py-0.5 rounded-full border"
                    :class="tagColor(i)"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="text-xs text-muted hidden sm:inline">{{ readTime(post.content) }}</span>
              </div>
            </div>
            <svg class="w-5 h-5 text-muted group-hover:text-accent transition-all duration-200 translate-x-0 group-hover:translate-x-1 shrink-0 mt-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
        </FadeInOnScroll>
      </div>
    </template>

    <div v-else class="text-center py-24">
      <p class="text-muted">{{ activeTag ? `No posts tagged "${activeTag}".` : 'No posts yet. Check back soon.' }}</p>
      <button v-if="activeTag" @click="activeTag = null" class="text-sm text-accent hover:underline mt-4 inline-block">
        Clear filter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FadeInOnScroll from '../components/shared/FadeInOnScroll.vue'
import { usePosts } from '../composables/usePosts.js'

const { posts } = usePosts()
const activeTag = ref(null)

const allTags = computed(() => {
  const tags = new Set()
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return [...tags].sort()
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts
  return posts.filter((p) => p.tags.includes(activeTag.value))
})

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function readTime(html) {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

const tagColors = [
  'border-accent/30 text-accent bg-accent/10',
  'border-emerald/30 text-emerald bg-emerald/10',
  'border-cyan/30 text-cyan bg-cyan/10',
  'border-amber/30 text-amber bg-amber/10',
]

function tagColor(index) {
  return tagColors[index % tagColors.length]
}
</script>
