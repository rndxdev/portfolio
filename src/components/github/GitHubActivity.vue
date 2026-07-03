<template>
  <section aria-labelledby="github-heading">
    <h2 id="github-heading" class="text-xl font-semibold text-text pt-4 flex items-center gap-2">
      GitHub activity
      <a
        :href="profileUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`@${username} on GitHub (opens in new tab)`"
        class="text-muted hover:text-accent transition-colors duration-300"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
      </a>
    </h2>

    <!-- Stat tiles -->
    <dl class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div
        v-for="(stat, i) in statList"
        :key="stat.label"
        class="rounded-lg border bg-surface px-4 py-3 text-center transition-all duration-300 hover:-translate-y-0.5"
        :class="statColor(i)"
      >
        <dt class="text-xs font-mono text-muted">{{ stat.label }}</dt>
        <dd class="text-2xl font-bold tabular-nums mt-1" :class="loading ? 'text-muted' : ''">
          <span v-if="loading" class="inline-block w-10 h-6 rounded bg-border/60 animate-pulse-dot align-middle" aria-hidden="true" />
          <span v-else>{{ formatNum(stat.value) }}</span>
        </dd>
      </div>
    </dl>

    <!-- Contribution graph (real GitHub data, fetched at build time) -->
    <GitHubContributions class="mt-6" />

    <!-- Top repositories -->
    <div v-if="topRepos.length" class="mt-6">
      <h3 class="text-sm font-mono text-accent mb-3">Most-starred repositories</h3>
      <ul class="grid sm:grid-cols-2 gap-3">
        <li v-for="repo in topRepos" :key="repo.id">
          <a
            :href="repo.html_url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${repo.name} repository on GitHub (opens in new tab)`"
            class="gradient-border block rounded-xl bg-surface p-4 h-full"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="font-mono text-sm text-text truncate">{{ repo.name }}</span>
              <span class="shrink-0 flex items-center gap-1 text-xs text-amber">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.174L12 18.897l-7.336 3.863 1.402-8.174L.132 9.21l8.2-1.192z" />
                </svg>
                {{ formatNum(repo.stargazers_count) }}
              </span>
            </div>
            <p v-if="repo.description" class="text-xs text-muted mt-2 line-clamp-2">{{ repo.description }}</p>
            <span
              v-if="repo.language"
              class="inline-flex items-center gap-1.5 mt-3 text-xs font-mono text-muted"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
              {{ repo.language }}
            </span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Error fallback -->
    <p v-if="error" class="mt-4 text-sm text-muted">
      Live stats are taking a break (GitHub rate limit). Visit
      <a
        :href="profileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent hover:text-text hover:underline transition-colors duration-300"
      >@{{ username }} on GitHub</a>
      to see the latest.
    </p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GitHubContributions from './GitHubContributions.vue'

const props = defineProps({
  username: { type: String, required: true },
})

const loading = ref(true)
const error = ref(false)
const stats = ref({ stars: 0, repos: 0, followers: 0, forks: 0 })
const topRepos = ref([])

const profileUrl = computed(() => `https://github.com/${props.username}`)

const statList = computed(() => [
  { label: 'Stars', value: stats.value.stars },
  { label: 'Repos', value: stats.value.repos },
  { label: 'Followers', value: stats.value.followers },
  { label: 'Forks', value: stats.value.forks },
])

const statColors = [
  'border-amber/30 hover:border-amber/50',
  'border-accent/30 hover:border-accent/50',
  'border-emerald/30 hover:border-emerald/50',
  'border-cyan/30 hover:border-cyan/50',
]
function statColor(i) {
  return statColors[i % statColors.length]
}

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + 'k'
  return String(n)
}

onMounted(async () => {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${props.username}`),
      fetch(`https://api.github.com/users/${props.username}/repos?per_page=100&sort=updated`),
    ])
    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error')

    const user = await userRes.json()
    const repos = await reposRes.json()

    const owned = repos.filter((r) => !r.fork)
    stats.value = {
      stars: owned.reduce((sum, r) => sum + r.stargazers_count, 0),
      repos: user.public_repos,
      followers: user.followers,
      forks: owned.reduce((sum, r) => sum + r.forks_count, 0),
    }
    topRepos.value = owned
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
