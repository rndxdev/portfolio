import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SITE_URL } from './src/site.config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Fetch the real GitHub contribution calendar (public, no token) at build time and
// expose it as `virtual:github-contributions`. Parses GitHub's own HTML fragment.
function githubContributions(username) {
  const VIRTUAL_ID = 'virtual:github-contributions'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  let cache = null

  function parse(html) {
    const tips = {}
    const tipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g
    let t
    while ((t = tipRe.exec(html))) tips[t[1]] = t[2].replace(/<[^>]*>/g, '').trim()

    const tagRe = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g
    const days = []
    let m
    while ((m = tagRe.exec(html))) {
      const tag = m[0]
      const date = (tag.match(/data-date="([^"]+)"/) || [])[1]
      if (!date) continue
      const level = parseInt((tag.match(/data-level="(\d+)"/) || [])[1] || '0', 10)
      const id = (tag.match(/id="([^"]+)"/) || [])[1]
      days.push({ date, level, tip: (id && tips[id]) || null })
    }
    days.sort((a, b) => a.date.localeCompare(b.date))

    const weeks = []
    let col = null
    for (const d of days) {
      const dow = new Date(d.date + 'T00:00:00Z').getUTCDay()
      if (dow === 0 || !col) {
        col = new Array(7).fill(null)
        weeks.push(col)
      }
      col[dow] = d
    }

    const totalM = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i)
    const total = totalM ? parseInt(totalM[1].replace(/,/g, ''), 10) : null
    return { weeks, total, count: days.length }
  }

  async function getData() {
    if (cache) return cache
    try {
      const res = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { 'x-requested-with': 'XMLHttpRequest', 'User-Agent': 'Mozilla/5.0' },
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      cache = parse(await res.text())
      console.log(`[github-contributions] ${cache.count} days, ${cache.total} contributions`)
    } catch (e) {
      console.warn('[github-contributions] fetch failed, graph will be hidden:', e.message)
      cache = { weeks: [], total: null, count: 0 }
    }
    return cache
  }

  return {
    name: 'github-contributions',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    async load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(await getData())}`
    },
  }
}

// Enumerate published blog posts so they can be prerendered and listed in the sitemap.
function blogRoutes() {
  const dir = resolve(__dirname, 'src/content/blog')
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !/^published:\s*false\s*$/m.test(readFileSync(resolve(dir, f), 'utf-8')))
    .map((f) => '/blog/' + f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''))
}

const dynamicRoutes = blogRoutes()

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    githubContributions('rndxdev'),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: ['/about', '/projects', '/certifications', '/blog', '/contact', ...dynamicRoutes],
      exclude: ['/:pathMatch(.*)*'],
      readable: true,
    }),
  ],
  // vite-ssg: prerender every static route plus each blog post to real HTML.
  ssgOptions: {
    formatting: 'minify',
    includedRoutes(paths) {
      const staticPaths = paths.filter((p) => !p.includes(':'))
      return [...new Set([...staticPaths, ...dynamicRoutes])]
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      'marked',
      'highlight.js/lib/core',
      'highlight.js/lib/languages/javascript',
      'highlight.js/lib/languages/typescript',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/bash',
      'highlight.js/lib/languages/json',
      'highlight.js/lib/languages/xml',
      'highlight.js/lib/languages/python',
      'highlight.js/lib/languages/sql',
      'highlight.js/lib/languages/php',
    ],
  },
})
