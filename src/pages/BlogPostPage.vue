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
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import PostContent from '../components/blog/PostContent.vue'
import ShareButtons from '../components/blog/ShareButtons.vue'
import { usePosts } from '../composables/usePosts.js'
import { useSeo } from '../composables/useSeo.js'
import { SITE_URL, SITE_NAME } from '../site.config.js'

const route = useRoute()
const { getPost } = usePosts()
const post = getPost(route.params.slug)
const shareUrl = SITE_URL + route.path

useSeo({
  title: post ? post.title : 'Post not found',
  description: post ? post.description : undefined,
  type: 'article',
  image: post ? `/og/${post.slug}.png` : undefined,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(post ? [{ name: post.title, path: route.path }] : []),
  ],
})

// BlogPosting schema so each article is understood as content authored by Ryan.
if (post) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date.toISOString().split('T')[0],
          url: shareUrl,
          keywords: post.tags,
          author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
        }),
      },
    ],
  })
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
