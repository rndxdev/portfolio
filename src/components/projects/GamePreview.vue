<template>
  <div ref="wrapper" class="preview-wrapper">
    <canvas ref="canvas" />
    <div class="preview-title">SWARMADA</div>
    <div class="preview-sub">hold the line against the alien swarm</div>
    <a
      v-if="liveUrl"
      :href="liveUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="preview-play"
      aria-label="Play Swarmada"
    >
      <span class="preview-play-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        PLAY
      </span>
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({ liveUrl: String })

const wrapper = ref(null)
const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cvs = canvas.value
  const ctx = cvs.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const W = wrapper.value.offsetWidth
  const H = wrapper.value.offsetHeight
  cvs.width = W * dpr
  cvs.height = H * dpr
  cvs.style.width = W + 'px'
  cvs.style.height = H + 'px'
  ctx.scale(dpr, dpr)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Seeded PRNG for deterministic star layout
  let seed = 42
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }

  // 3-layer parallax starfield (matches game's build_star_tiles)
  const layers = [
    { speed: 12, r: 1, col: [70, 80, 115] },
    { speed: 25, r: 1, col: [140, 150, 195] },
    { speed: 45, r: 1.5, col: [215, 225, 255] },
  ].map((l, _, __, count = [35, 20, 10]) => ({
    ...l,
    stars: Array.from({ length: count.shift() }, () => ({
      x: rand() * W, y: rand() * H, b: 0.5 + rand() * 0.5,
    })),
  }))

  // Game state
  const ship = { x: W * 0.35, y: H * 0.55, vx: 100, vy: 0, angle: 0 }
  const tgt = { x: W * 0.5, y: H * 0.4 }
  const enemies = []
  const bolts = []
  const particles = []
  let fireT = 0, spawnT = 0

  const E_COLS = [[235, 110, 110], [245, 170, 90], [200, 90, 200]]
  const E_R = [6, 5, 10]

  let last = performance.now()

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    if (!reducedMotion) {
      // Scroll stars
      for (const l of layers) {
        for (const s of l.stars) {
          s.x -= l.speed * dt
          if (s.x < -2) s.x += W + 4
        }
      }

      // Spawn enemies
      spawnT -= dt
      if (spawnT <= 0 && enemies.length < 6) {
        spawnT = 0.5 + Math.random() * 0.9
        const ci = Math.floor(Math.random() * 3)
        const side = Math.random()
        let ex, ey, evx, evy
        if (side < 0.6) {
          ex = W + 15; ey = 15 + Math.random() * (H - 30)
          evx = -(90 + Math.random() * 90); evy = -15 + Math.random() * 30
        } else if (side < 0.8) {
          ex = Math.random() * W; ey = -15
          evx = -20 + Math.random() * -40; evy = 60 + Math.random() * 80
        } else {
          ex = Math.random() * W; ey = H + 15
          evx = -20 + Math.random() * -40; evy = -(60 + Math.random() * 80)
        }
        enemies.push({ x: ex, y: ey, vx: evx, vy: evy, ci, r: E_R[ci] })
      }

      // Ship AI — head to waypoint, swerve around enemies
      const dx = tgt.x - ship.x, dy = tgt.y - ship.y
      if (Math.hypot(dx, dy) < 30) {
        tgt.x = W * 0.15 + Math.random() * W * 0.5
        tgt.y = 25 + Math.random() * (H - 50)
      }
      let ax = 0, ay = 0
      const dl = Math.hypot(dx, dy)
      if (dl > 0) { ax = dx / dl * 180; ay = dy / dl * 180 }
      for (const e of enemies) {
        const ox = ship.x - e.x, oy = ship.y - e.y
        const d = Math.hypot(ox, oy)
        if (d > 0 && d < 60) { ax += ox / d * (60 - d) * 3; ay += oy / d * (60 - d) * 3 }
      }
      ship.vx += (ax - ship.vx) * Math.min(1, dt * 3)
      ship.vy += (ay - ship.vy) * Math.min(1, dt * 3)
      const spd = Math.hypot(ship.vx, ship.vy)
      if (spd > 200) { ship.vx *= 200 / spd; ship.vy *= 200 / spd }
      ship.x = Math.max(15, Math.min(W - 15, ship.x + ship.vx * dt))
      ship.y = Math.max(15, Math.min(H - 35, ship.y + ship.vy * dt))
      if (spd > 3) ship.angle = Math.atan2(ship.vy, ship.vx) + Math.PI / 2

      // Auto-fire at closest enemy
      fireT -= dt
      if (fireT <= 0 && enemies.length) {
        let best = enemies[0], bd = Infinity
        for (const e of enemies) {
          const d = Math.hypot(e.x - ship.x, e.y - ship.y)
          if (d < bd) { bd = d; best = e }
        }
        const bx = best.x - ship.x, by = best.y - ship.y, bl = Math.hypot(bx, by)
        if (bl > 0) bolts.push({ x: ship.x, y: ship.y, vx: bx / bl * 400, vy: by / bl * 400 })
        fireT = 0.22
      }

      // Update bolts + hit detection
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        b.x += b.vx * dt; b.y += b.vy * dt
        if (b.x < -10 || b.x > W + 10 || b.y < -10 || b.y > H + 10) { bolts.splice(i, 1); continue }
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j]
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.r + 4) {
            for (let k = 0; k < 6; k++) {
              const a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * 100
              particles.push({ x: e.x, y: e.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.4, max: 0.4 })
            }
            enemies.splice(j, 1); bolts.splice(i, 1); break
          }
        }
      }

      // Update enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i]
        e.x += e.vx * dt; e.y += e.vy * dt
        if (e.x < -25 || e.y < -25 || e.y > H + 25) enemies.splice(i, 1)
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy *= 0.94; p.life -= dt
        if (p.life <= 0) particles.splice(i, 1)
      }
    }

    // --- Draw ---
    ctx.fillStyle = 'rgb(16,18,28)'
    ctx.fillRect(0, 0, W, H)

    // Stars
    for (const l of layers) {
      for (const s of l.stars) {
        const [r, g, b] = l.col
        ctx.fillStyle = `rgb(${Math.round(r * s.b)},${Math.round(g * s.b)},${Math.round(b * s.b)})`
        ctx.beginPath(); ctx.arc(s.x, s.y, l.r, 0, Math.PI * 2); ctx.fill()
      }
    }

    // Particles
    for (const p of particles) {
      const a = p.life / p.max
      ctx.globalAlpha = a
      ctx.fillStyle = 'rgb(255,200,120)'
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, 3 * a), 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // Enemies
    for (const e of enemies) {
      const [r, g, b] = E_COLS[e.ci]
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill()
    }

    // Bolts
    ctx.fillStyle = 'rgb(255,240,140)'
    for (const b of bolts) { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill() }

    // Ship engine flame
    if (!reducedMotion && Math.hypot(ship.vx, ship.vy) > 3) {
      ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle)
      ctx.fillStyle = 'rgb(255,180,80)'
      ctx.beginPath(); ctx.arc(0, 12, 3, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    // Ship (cyan triangle)
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle)
    ctx.shadowColor = 'rgb(80,200,255)'; ctx.shadowBlur = 8
    ctx.fillStyle = 'rgb(80,200,255)'
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-5, 6); ctx.lineTo(5, 6); ctx.closePath(); ctx.fill()
    ctx.shadowBlur = 0; ctx.restore()

    raf = requestAnimationFrame(frame)
  }

  raf = requestAnimationFrame(frame)
})

onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
.preview-wrapper {
  position: relative;
  height: 11rem;
  overflow: hidden;
}
.preview-wrapper canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.preview-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
  font-family: var(--font-mono);
  font-size: 1.75rem;
  font-weight: 700;
  color: rgb(235, 238, 245);
  text-shadow: 3px 3px 0 rgb(18, 26, 44);
  letter-spacing: 0.05em;
  pointer-events: none;
}
.preview-sub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: rgb(255, 210, 90);
  white-space: nowrap;
  pointer-events: none;
}
.preview-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.3s;
}
.preview-play:hover {
  background: rgba(0, 0, 0, 0.45);
}
.preview-play-btn {
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
.preview-play:hover .preview-play-btn {
  opacity: 1;
  transform: scale(1);
}
</style>
