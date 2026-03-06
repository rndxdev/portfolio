import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import php from 'highlight.js/lib/languages/php'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('php', php)

const renderer = new marked.Renderer()
const defaultLinkRenderer = renderer.link.bind(renderer)
renderer.link = function ({ href, title, tokens }) {
  const html = defaultLinkRenderer({ href, title, tokens })
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    return html.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ')
  }
  return html
}

marked.setOptions({
  renderer,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return code
  },
})

/**
 * Simple YAML frontmatter parser (no Node.js dependencies).
 * Parses the --- delimited block at the top of a markdown string.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const yaml = match[1]
  const content = match[2]
  const data = {}

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // Parse arrays like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      continue
    }

    // Parse booleans
    if (value === 'true') { data[key] = true; continue }
    if (value === 'false') { data[key] = false; continue }

    data[key] = value
  }

  return { data, content }
}

const modules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parsePosts() {
  return Object.entries(modules)
    .map(([filepath, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      const filename = filepath.split('/').pop().replace('.md', '')
      // Strip date prefix from filename for slug: 2026-03-05-hello-world → hello-world
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '')

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date + 'T00:00:00') : new Date(),
        description: data.description || '',
        tags: data.tags || [],
        published: data.published !== false,
        content: marked(content),
      }
    })
    .filter((post) => post.published)
    .sort((a, b) => b.date - a.date)
}

const posts = parsePosts()

export function usePosts() {
  return {
    posts,
    getPost(slug) {
      return posts.find((p) => p.slug === slug) || null
    },
  }
}
