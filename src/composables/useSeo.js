import { computed, unref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE } from '../site.config'

/**
 * Set per-route SEO tags: title, description, canonical, Open Graph, Twitter.
 * Values may be plain strings or refs (for async content like blog posts).
 *
 * @param {Object} opts
 * @param {string} [opts.title]        Page title (name suffix appended automatically).
 * @param {string} [opts.description]  Meta description; falls back to the site default.
 * @param {string} [opts.type]         Open Graph type ('website' | 'article').
 * @param {string} [opts.image]        OG image path or absolute URL; defaults to site image.
 */
export function useSeo(opts = {}) {
  const route = useRoute()

  const fullTitle = computed(() => {
    const t = unref(opts.title)
    return t ? `${t} — ${SITE_NAME}` : SITE_TITLE
  })
  const description = computed(() => unref(opts.description) || SITE_DESCRIPTION)
  const url = computed(() => SITE_URL + route.path)
  const image = computed(() => {
    const img = unref(opts.image) || OG_IMAGE
    return img.startsWith('http') ? img : SITE_URL + img
  })
  const type = computed(() => unref(opts.type) || 'website')

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
}
