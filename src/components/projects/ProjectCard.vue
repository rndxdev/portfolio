<template>
  <article
    class="group gradient-border rounded-xl bg-surface transition-all duration-300 hover:-translate-y-1"
    :class="{ 'overflow-hidden': project.type === 'game' }"
  >
    <!-- Game Preview Banner -->
    <div v-if="project.type === 'game'" class="game-preview">
      <span
        v-for="s in stars"
        :key="s.id"
        class="star"
        :style="{
          left: s.x + '%',
          top: s.y + '%',
          width: s.size + 'px',
          height: s.size + 'px',
          animationDelay: s.delay + 's',
        }"
      />
      <div class="enemy-formation">
        <span
          v-for="n in 7"
          :key="'a'+n"
          class="enemy"
          :style="{ animationDelay: n * 0.1 + 's' }"
        />
      </div>
      <div class="enemy-formation enemy-formation--row2">
        <span
          v-for="n in 5"
          :key="'b'+n"
          class="enemy enemy--alt"
          :style="{ animationDelay: (n * 0.1 + 0.25) + 's' }"
        />
      </div>
      <div class="ship" />
      <div class="laser" />
      <div class="laser laser--2" />
      <div class="scanlines" />
      <a
        v-if="project.live"
        :href="project.live"
        target="_blank"
        rel="noopener noreferrer"
        class="play-overlay"
        :aria-label="`Play ${project.title}`"
      >
        <span class="play-btn">
          <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          PLAY
        </span>
      </a>
    </div>

    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold group-hover:text-text transition-colors duration-300">
          {{ project.title }}
        </h3>
        <div class="flex gap-3">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted hover:text-accent transition-colors duration-300 hover:scale-110 inline-block"
            :aria-label="`${project.title} on GitHub (opens in new tab)`"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a
            v-if="project.live"
            :href="project.live"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted hover:text-emerald transition-colors duration-300 hover:scale-110 inline-block"
            :aria-label="`${project.title} live site (opens in new tab)`"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
        </div>
      </div>
      <p class="text-sm text-muted leading-relaxed mb-4">{{ project.description }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(t, i) in project.tech"
          :key="t"
          class="text-xs font-mono px-2.5 py-1 rounded-full border transition-colors duration-300"
          :class="tagColor(i)"
        >
          {{ t }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
})

const colors = [
  'border-accent/30 text-accent bg-accent/10',
  'border-emerald/30 text-emerald bg-emerald/10',
  'border-cyan/30 text-cyan bg-cyan/10',
  'border-amber/30 text-amber bg-amber/10',
]

function tagColor(index) {
  return colors[index % colors.length]
}

const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: ((i * 47 + 13) % 97) + 1,
  y: ((i * 31 + 7) % 97) + 1,
  size: 1 + (i % 3),
  delay: ((i * 7) % 30) / 10,
}))
</script>

<style scoped>
.game-preview {
  position: relative;
  height: 10rem;
  background: linear-gradient(to bottom, #070720, #0a0a2e 60%, var(--color-surface));
  overflow: hidden;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: twinkle 2s ease-in-out infinite;
}

.enemy-formation {
  position: absolute;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.25rem;
  animation: sway 4s ease-in-out infinite;
}

.enemy-formation--row2 {
  top: 2.75rem;
}

.enemy {
  width: 10px;
  height: 10px;
  background: var(--color-rose);
  transform: rotate(45deg);
  animation: enemy-pulse 1.5s ease-in-out infinite;
  opacity: 0.85;
}

.enemy--alt {
  width: 8px;
  height: 8px;
  background: var(--color-amber);
}

.ship {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 20px solid var(--color-emerald);
  filter: drop-shadow(0 0 6px var(--color-emerald));
  animation: ship-float 3s ease-in-out infinite;
}

.laser {
  position: absolute;
  bottom: 3.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 0;
  background: var(--color-cyan);
  box-shadow: 0 0 4px var(--color-cyan), 0 0 8px var(--color-cyan);
  animation: laser-fire 2s ease-out infinite;
}

.laser--2 {
  animation-delay: 1s;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.3s;
}

.play-overlay:hover {
  background: rgba(0, 0, 0, 0.45);
}

.play-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  color: white;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s, transform 0.3s;
}

.play-overlay:hover .play-btn {
  opacity: 1;
  transform: scale(1);
}

.play-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.9; }
}

@keyframes sway {
  0%, 100% { transform: translateX(-50%); }
  25% { transform: translateX(calc(-50% + 10px)); }
  75% { transform: translateX(calc(-50% - 10px)); }
}

@keyframes enemy-pulse {
  0%, 100% { opacity: 0.6; transform: rotate(45deg) scale(1); }
  50% { opacity: 1; transform: rotate(45deg) scale(1.15); }
}

@keyframes ship-float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

@keyframes laser-fire {
  0% { height: 0; opacity: 0; bottom: 3.75rem; }
  10% { height: 14px; opacity: 1; }
  80% { opacity: 1; }
  100% { height: 14px; bottom: 9rem; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .star, .enemy, .ship, .laser, .enemy-formation {
    animation: none;
  }
  .star { opacity: 0.5; }
  .enemy { opacity: 0.85; }
  .laser { height: 14px; opacity: 0.7; bottom: 3.75rem; }
}
</style>
