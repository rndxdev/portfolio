import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import { marked } from 'marked'
import { Resvg } from '@resvg/resvg-js'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readPosts } from './src/lib/postsNode.js'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './src/site.config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = resolve(__dirname, 'src/content/blog')
const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

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

// Published blog posts → routes, for prerendering and the sitemap.
const dynamicRoutes = readPosts(BLOG_DIR).map((p) => '/blog/' + p.slug)

// Generate an RSS 2.0 feed from the blog at build time.
function rssFeed() {
  return {
    name: 'rss-feed',
    generateBundle() {
      const posts = readPosts(BLOG_DIR)
      const items = posts
        .map((p) => {
          const url = `${SITE_URL}/blog/${p.slug}`
          return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${xmlEscape(p.description)}</description>
${p.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join('\n')}
      <content:encoded><![CDATA[${marked(p.content)}]]></content:encoded>
    </item>`
        })
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: xml })
    },
  }
}

// Wrap text into at most `maxLines` lines of ~`perLine` characters.
function wrapText(text, perLine, maxLines) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > perLine && line) {
      lines.push(line)
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
    if (lines.length === maxLines - 1 && (line + ' ').length > perLine) break
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = lines[maxLines - 1].replace(/.{1}$/, '…')
  }
  return lines.slice(0, maxLines)
}

// Rasterize a 1200×630 branded social card to PNG (resvg + system fonts).
function renderCard({ kicker, title, subtitle }) {
  const lines = wrapText(title, 22, 3)
  const size = lines.length >= 3 ? 74 : lines.length === 2 ? 92 : 104
  const startY = 300 - (lines.length - 1) * (size * 0.6)
  const titleSvg = lines
    .map((l, i) => `<text x="80" y="${startY + i * size * 1.15}" font-family="Ubuntu, sans-serif" font-size="${size}" font-weight="700" fill="url(#g)">${xmlEscape(l)}</text>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#939dfa"/><stop offset="50%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
    <radialGradient id="glow" cx="15%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#939dfa" stop-opacity="0.20"/><stop offset="100%" stop-color="#939dfa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="4" y="4" width="1192" height="622" rx="24" fill="none" stroke="#3a3a3a" stroke-width="2"/>
  <text x="80" y="130" font-family="Ubuntu Mono, monospace" font-size="26" fill="#939dfa" letter-spacing="2">${xmlEscape(kicker)}</text>
  ${titleSvg}
  <text x="80" y="540" font-family="Ubuntu, sans-serif" font-size="34" fill="#a3a3a3">${xmlEscape(subtitle)}</text>
</svg>`
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true, defaultFontFamily: 'Ubuntu' } })
    .render()
    .asPng()
}

// Generate the site card + one card per blog post as real PNGs.
function ogImages() {
  return {
    name: 'og-images',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'og-image.png',
        source: renderCard({ kicker: '$ whoami', title: SITE_NAME, subtitle: 'Full-Stack Developer · Michigan' }),
      })
      for (const p of readPosts(BLOG_DIR)) {
        this.emitFile({
          type: 'asset',
          fileName: `og/${p.slug}.png`,
          source: renderCard({ kicker: 'BLOG · rndx.dev', title: p.title, subtitle: SITE_NAME }),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    githubContributions('rndxdev'),
    rssFeed(),
    ogImages(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: ['/about', '/projects', '/certifications', '/resume', '/blog', '/contact', ...dynamicRoutes],
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
