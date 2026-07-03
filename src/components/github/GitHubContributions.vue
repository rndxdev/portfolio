<template>
  <figure v-if="weeks.length" class="gh-contrib rounded-lg border border-border bg-surface p-4 overflow-x-auto">
    <svg :viewBox="`0 0 ${svgW} ${svgH}`" :width="svgW" :height="svgH" role="img" :aria-label="ariaLabel" class="gh-svg">
      <g :transform="`translate(${PAD_L}, ${PAD_T})`">
        <text v-for="m in monthLabels" :key="`m-${m.x}`" :x="m.x" y="-4" class="gh-lbl">{{ m.label }}</text>
        <text v-for="d in dayLabels" :key="`d-${d.label}`" x="-6" :y="d.y" class="gh-lbl" text-anchor="end">{{ d.label }}</text>
        <rect
          v-for="(c, i) in cells"
          :key="i"
          :x="c.x"
          :y="c.y"
          :width="CELL"
          :height="CELL"
          rx="2"
          :fill="c.fill"
        >
          <title>{{ c.title }}</title>
        </rect>
      </g>
    </svg>

    <figcaption class="flex items-center justify-between gap-4 mt-3 text-xs text-muted">
      <span v-if="total != null">{{ total.toLocaleString() }} contributions in the last year</span>
      <span class="flex items-center gap-1.5 ml-auto">
        Less
        <span v-for="(c, i) in LEVELS" :key="i" class="gh-legend" :style="{ background: c }" aria-hidden="true" />
        More
      </span>
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue'
import contributions from 'virtual:github-contributions'

// GitHub dark-theme contribution colors (levels 0–4).
const LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
const CELL = 11
const GAP = 3
const STEP = CELL + GAP
const PAD_L = 30
const PAD_T = 16
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const weeks = contributions.weeks || []
const total = contributions.total

const svgW = computed(() => PAD_L + weeks.length * STEP)
const svgH = PAD_T + 7 * STEP + 2

const ariaLabel = computed(
  () => `GitHub contribution graph${total != null ? `: ${total} contributions in the last year` : ''}`,
)

const cells = computed(() => {
  const out = []
  weeks.forEach((col, wi) => {
    col.forEach((d, di) => {
      if (!d) return
      out.push({
        x: wi * STEP,
        y: di * STEP,
        fill: LEVELS[d.level] || LEVELS[0],
        title: d.tip || d.date,
      })
    })
  })
  return out
})

const monthLabels = computed(() => {
  const out = []
  let last = -1
  weeks.forEach((col, wi) => {
    const day = col.find(Boolean)
    if (!day) return
    const month = parseInt(day.date.slice(5, 7), 10) - 1
    if (month !== last) {
      out.push({ x: wi * STEP, label: MONTHS[month] })
      last = month
    }
  })
  return out
})

// Mon / Wed / Fri, matching GitHub. y = row center baseline.
const dayLabels = [
  { label: 'Mon', y: 1 * STEP + CELL - 1 },
  { label: 'Wed', y: 3 * STEP + CELL - 1 },
  { label: 'Fri', y: 5 * STEP + CELL - 1 },
]
</script>

<style scoped>
.gh-svg {
  max-width: none;
  height: auto;
}
.gh-lbl {
  fill: var(--color-muted);
  font-family: var(--font-mono);
  font-size: 9px;
}
.gh-legend {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>
