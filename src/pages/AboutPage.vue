<template>
  <div class="max-w-3xl mx-auto px-6 py-16 md:py-24">
    <!-- Profile header -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 animate-fade-up">
      <a :href="githubUrl" target="_blank" rel="noopener noreferrer"
        :aria-label="`${githubUsername} on GitHub (opens in new tab)`" class="shrink-0 group">
        <div class="relative">
          <!-- Animated gradient ring -->
          <div
            class="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-cyan to-emerald opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-500"
            style="animation: gradient-shift 4s ease infinite; background-size: 200% 200%;" aria-hidden="true" />
          <img :src="avatarUrl" alt="" class="relative w-28 h-28 rounded-full border-2 border-bg" />
        </div>
      </a>
      <div class="text-center sm:text-left">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
          <span class="gradient-text">Ryan Dickinson</span>
        </h1>
        <p class="text-muted mt-1">Full-Stack Developer</p>
        <div class="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted">
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Michigan
          </span>
          <a :href="githubUrl" target="_blank" rel="noopener noreferrer"
            :aria-label="`${githubUsername} on GitHub (opens in new tab)`"
            class="flex items-center gap-1.5 hover:text-accent transition-colors duration-300">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {{ githubUsername }}
          </a>
        </div>
      </div>
    </div>

    <div class="space-y-6 text-muted leading-relaxed">
      <p class="animate-fade-up animate-delay-1">
        I’m Ryan, a full-stack developer who enjoys building useful, well-crafted, and open sourced software. I got into
        programming to solve real problems, and that’s still what motivates the work I do today.
      </p>

      <p class="animate-fade-up animate-delay-2">
        Most of my free time aside from my day job goes into open source work and side projects. My biggest project
        right now is the
        <a href="https://github.com/rndxdev/safe-ice-tool" target="_blank" rel="noopener noreferrer"
          class="text-accent hover:text-text hover:underline transition-colors duration-300">SIT (Safe Ice Tool)</a>
        — Stay In The Knowledge, or sit at home if conditions aren't safe. It's a community-driven platform that helps
        people share real-time ice conditions. It started because I spend a lot of time ice fishing in Michigan and saw
        a gap that technology could fill.
      </p>

      <p class="animate-fade-up animate-delay-3"> I believe software is at its best when it brings people together.
        Whether that means building tools that help anglers stay safe on the ice or creating tools that make another
        developer’s work easier, I enjoy building things that strengthen communities and make life a little better.</p>

      <h2 class="text-xl font-semibold text-text pt-4 animate-fade-up animate-delay-4">Tools in my toolkit</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fade-up animate-delay-5">
        <template v-for="(tech, i) in stack" :key="tech.name">
          <!-- SQL card with hover dropdown -->
          <div v-if="tech.flavors" class="relative group" tabindex="0">
            <div
              class="text-sm font-mono px-3 py-2.5 rounded-lg border text-center cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 group-focus:-translate-y-0.5 group-focus:scale-105"
              :class="techColor(i)">
              {{ tech.name }}
            </div>
            <div
              class="absolute top-full left-0 right-0 mt-2 py-2 px-3 rounded-lg bg-surface border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-10 shadow-lg">
              <p class="text-xs text-muted mb-1.5">Databases:</p>
              <div class="flex flex-col gap-1">
                <a v-for="flavor in tech.flavors" :key="flavor.name" :href="flavor.url" target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-mono text-text hover:text-accent transition-colors duration-200">
                  {{ flavor.name }}
                </a>
              </div>
              <div v-if="tech.tool" class="mt-2 pt-2 border-t border-border">
                <p class="text-xs text-muted mb-1">Tool:</p>
                <a :href="tech.tool.url" target="_blank" rel="noopener noreferrer"
                  class="text-xs font-mono text-text hover:text-accent transition-colors duration-200">
                  {{ tech.tool.name }}
                </a>
              </div>
            </div>
          </div>
          <!-- Regular tech card -->
          <a v-else :href="tech.url" target="_blank" rel="noopener noreferrer"
            class="text-sm font-mono px-3 py-2.5 rounded-lg border text-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            :class="techColor(i)">
            {{ tech.name }}
          </a>
        </template>
      </div>

      <h2 class="text-xl font-semibold text-text pt-4">Outside the code editor</h2>
      <p>
        When I'm not writing code, I'm usually outside — fishing, hiking, hunting, and exploring the beautiful outdoors
        that is Michigan. I enjoy nature and embrace community. I think spending time outdoors makes me a better developer.
        It keeps things in perspective and gives me ideas for problems worth solving.
      </p>
    </div>
  </div>
</template>

<script setup>
const githubUsername = 'rndxdev'
const githubUrl = `https://github.com/${githubUsername}`
const avatarUrl = `https://github.com/${githubUsername}.png`

const stack = [
  { name: 'PHP/Laravel', url: 'https://laravel.com' },
  { name: 'Vue.js', url: 'https://vuejs.org' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  {
    name: 'SQL',
    flavors: [
      { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
      { name: 'MySQL', url: 'https://www.mysql.com' },
      { name: 'MariaDB', url: 'https://mariadb.org' },
      { name: 'SQLite', url: 'https://www.sqlite.org' },
      { name: 'OracleSQL', url: 'https://www.oracle.com/database/' },
    ],
    tool: { name: 'DataGrip', url: 'https://www.jetbrains.com/datagrip/' },
  },
  { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'Git', url: 'https://git-scm.com' },
  { name: 'Linux', url: 'https://www.linux.org' },
]

const techColors = [
  'border-rose/30 bg-rose/5 text-rose hover:bg-rose/15 hover:border-rose/50',
  'border-emerald/30 bg-emerald/5 text-emerald hover:bg-emerald/15 hover:border-emerald/50',
  'border-cyan/30 bg-cyan/5 text-cyan hover:bg-cyan/15 hover:border-cyan/50',
  'border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 hover:border-accent/50',
  'border-amber/30 bg-amber/5 text-amber hover:bg-amber/15 hover:border-amber/50',
]

function techColor(index) {
  return techColors[index % techColors.length]
}
</script>
