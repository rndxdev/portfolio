<template>
  <transition name="cmdk">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]"
      @click.self="close"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div
        class="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <!-- Search -->
        <div class="flex items-center gap-3 px-4 border-b border-border">
          <svg class="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            :aria-activedescendant="filtered[selected] ? `cmdk-opt-${selected}` : undefined"
            placeholder="Search pages, posts, links…"
            class="flex-1 bg-transparent py-4 text-text placeholder-muted focus:outline-none text-sm"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="activate(filtered[selected])"
            @keydown.esc.prevent="close"
          />
          <kbd class="hidden sm:block text-[10px] font-mono text-muted border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <!-- Results -->
        <ul v-if="filtered.length" id="cmdk-list" ref="listEl" role="listbox" class="max-h-80 overflow-y-auto py-2">
          <li
            v-for="(item, i) in filtered"
            :id="`cmdk-opt-${i}`"
            :key="item.id"
            role="option"
            :aria-selected="i === selected"
            class="mx-2 px-3 py-2.5 rounded-lg flex items-center gap-3 cursor-pointer text-sm"
            :class="i === selected ? 'bg-accent/15 text-text' : 'text-muted'"
            @click="activate(item)"
            @mousemove="selected = i"
          >
            <span class="shrink-0 w-6 text-center" :class="i === selected ? 'text-accent' : 'text-muted'" v-html="item.icon" />
            <span class="flex-1 min-w-0 truncate">{{ item.label }}</span>
            <span v-if="item.hint" class="text-[11px] font-mono shrink-0" :class="i === selected ? 'text-accent' : 'text-muted/70'">{{ item.hint }}</span>
          </li>
        </ul>
        <div v-else class="px-4 py-8 text-center text-sm text-muted">No matches for “{{ query }}”.</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommandPalette } from '../composables/useCommandPalette.js'
import { usePosts } from '../composables/usePosts.js'
import { PROFILES } from '../site.config.js'

const { isOpen, open, close, toggle } = useCommandPalette()
const router = useRouter()
const { posts } = usePosts()

const query = ref('')
const selected = ref(0)
const inputEl = ref(null)
const listEl = ref(null)

const ICONS = {
  page: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>',
  post: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V5.25A2.25 2.25 0 016.75 3h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0119.5 8.62z"/></svg>',
  ext: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>',
}

const pages = [
  { id: 'p-home', label: 'Home', to: '/', hint: 'Page', icon: ICONS.page },
  { id: 'p-about', label: 'About', to: '/about', hint: 'Page', icon: ICONS.page },
  { id: 'p-projects', label: 'Projects', to: '/projects', hint: 'Page', icon: ICONS.page },
  { id: 'p-certs', label: 'Certifications', to: '/certifications', hint: 'Page', icon: ICONS.page },
  { id: 'p-resume', label: 'Résumé', to: '/resume', hint: 'Page', icon: ICONS.page },
  { id: 'p-blog', label: 'Blog', to: '/blog', hint: 'Page', icon: ICONS.page },
  { id: 'p-contact', label: 'Contact', to: '/contact', hint: 'Page', icon: ICONS.page },
]

const external = [
  { id: 'x-github', label: 'GitHub — rndxdev', href: PROFILES.github, hint: '↗', icon: ICONS.ext },
  { id: 'x-email', label: 'Email hello@rndx.dev', href: 'mailto:hello@rndx.dev', hint: '↗', icon: ICONS.ext },
  { id: 'x-rss', label: 'RSS feed', href: '/rss.xml', hint: '↗', icon: ICONS.ext },
]

const commands = computed(() => [
  ...pages,
  ...posts.map((p) => ({ id: `post-${p.slug}`, label: p.title, to: `/blog/${p.slug}`, hint: 'Post', icon: ICONS.post })),
  ...external,
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q))
})

watch(query, () => (selected.value = 0))
watch(isOpen, async (v) => {
  if (v) {
    query.value = ''
    selected.value = 0
    await nextTick()
    inputEl.value?.focus()
  }
})

function move(delta) {
  const n = filtered.value.length
  if (!n) return
  selected.value = (selected.value + delta + n) % n
  nextTick(() => {
    listEl.value?.querySelector(`#cmdk-opt-${selected.value}`)?.scrollIntoView({ block: 'nearest' })
  })
}

function activate(item) {
  if (!item) return
  close()
  if (item.to) {
    router.push(item.to)
  } else if (item.href) {
    if (item.href.startsWith('mailto:')) window.location.href = item.href
    else window.open(item.href, item.href.startsWith('http') ? '_blank' : '_self', 'noopener')
  }
}

function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
defineExpose({ open })
</script>

<style scoped>
.cmdk-enter-active,
.cmdk-leave-active {
  transition: opacity 0.15s ease;
}
.cmdk-enter-from,
.cmdk-leave-to {
  opacity: 0;
}
</style>
