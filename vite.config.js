import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SITE_URL } from './src/site.config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
