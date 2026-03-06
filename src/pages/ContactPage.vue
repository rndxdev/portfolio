<template>
  <div class="max-w-xl mx-auto px-6 py-16 md:py-24">
    <template v-if="!submitted">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-4 animate-fade-up"><span class="gradient-text">Contact</span></h1>
    <p class="text-muted mb-2">
      Have a question or want to work together? Drop me a message or email me at
      <a href="mailto:hello@rndx.dev" class="text-accent hover:underline transition-colors">hello@rndx.dev</a>.
    </p>
    <p class="text-sm text-muted mb-10">
      Fields marked with <span class="text-rose">*</span> are required.
    </p>

    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p class="hidden">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>

      <div>
        <label for="name" class="block text-sm text-muted mb-2">Name <span class="text-rose" aria-hidden="true">*</span></label>
        <input
          id="name"
          v-model="form.name"
          name="name"
          type="text"
          required
          aria-required="true"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:border-accent focus:ring-2 focus:ring-accent/40 focus-visible:outline-none transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label for="email" class="block text-sm text-muted mb-2">Email <span class="text-rose" aria-hidden="true">*</span></label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          required
          aria-required="true"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:border-accent focus:ring-2 focus:ring-accent/40 focus-visible:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label for="message" class="block text-sm text-muted mb-2">Message <span class="text-rose" aria-hidden="true">*</span></label>
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          required
          aria-required="true"
          rows="5"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:border-accent focus:ring-2 focus:ring-accent/40 focus-visible:outline-none transition-colors resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-accent text-bg text-sm font-medium rounded-lg hover:bg-accent-hover transition-all duration-300 glow-accent hover:scale-[1.02]"
      >
        Send Message
      </button>
    </form>
    </template>

    <div v-else class="text-center py-12" role="alert" aria-live="polite">
      <p class="text-lg text-text mb-2">Message sent!</p>
      <p class="text-muted">Thanks for reaching out. I'll get back to you soon.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const submitted = ref(false)
const form = reactive({
  name: '',
  email: '',
  message: '',
})

async function handleSubmit() {
  const body = new URLSearchParams({
    'form-name': 'contact',
    name: form.name,
    email: form.email,
    message: form.message,
  })

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    submitted.value = true
  } catch {
    alert('Something went wrong. Please try again.')
  }
}
</script>
