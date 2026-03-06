<template>
  <div class="max-w-3xl mx-auto px-6 py-16 md:py-24">
    <article v-if="post">
      <router-link to="/blog" class="text-sm text-muted hover:text-accent transition-colors mb-8 inline-block">
        &larr; Back to blog
      </router-link>
      <header class="mb-12">
        <time class="text-sm font-mono text-muted" :datetime="post.date.toISOString().split('T')[0]">{{ formatDate(post.date) }}</time>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mt-3">{{ post.title }}</h1>
        <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-4" role="list" aria-label="Post tags">
          <span
            v-for="tag in post.tags"
            :key="tag"
            role="listitem"
            class="text-xs font-mono px-2.5 py-1 rounded-full bg-border/50 text-muted"
          >
            {{ tag }}
          </span>
        </div>
      </header>
      <PostContent :html="post.content" />
      <ShareButtons :title="post.title" :url="shareUrl" />
    </article>
    <div v-else class="text-center py-24">
      <p class="text-muted">Post not found.</p>
      <router-link to="/blog" class="text-sm text-accent hover:underline mt-4 inline-block">
        Back to blog
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PostContent from '../components/blog/PostContent.vue'
import ShareButtons from '../components/blog/ShareButtons.vue'
import { usePosts } from '../composables/usePosts.js'

const route = useRoute()
const { getPost } = usePosts()
const post = getPost(route.params.slug)
const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
