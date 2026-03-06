<template>
  <div class="grid gap-6">
    <PostCard v-for="post in posts" :key="post.slug" :post="post" />
  </div>
</template>

<script setup>
import PostCard from './PostCard.vue'

defineProps({
  posts: { type: Array, required: true },
})
</script>
