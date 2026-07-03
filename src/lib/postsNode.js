// Node-side blog reader — used at BUILD time by vite.config.js (RSS, sitemap, OG
// images). The browser/runtime equivalent is src/composables/usePosts.js.
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data = {}
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else if (value === 'true') data[key] = true
    else if (value === 'false') data[key] = false
    else data[key] = value
    if (key === 'content') continue
  }
  return { data, content: match[2] }
}

/** Read all published posts, newest first. */
export function readPosts(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = readFileSync(resolve(dir, filename), 'utf-8')
      const { data, content } = parseFrontmatter(raw)
      const slug = filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      return {
        slug,
        title: data.title || slug,
        date: data.date || '1970-01-01',
        description: data.description || '',
        tags: data.tags || [],
        published: data.published !== false,
        content,
      }
    })
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
