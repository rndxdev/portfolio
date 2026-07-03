import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_NAME, OG_IMAGE, SITE_LOCALE, ANALYTICS } from './site.config'
import './styles/global.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  },
  ({ head }) => {
    // Site-wide default head — pages override title/description via useSeo().
    head?.push({
      title: SITE_TITLE,
      meta: [
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: SITE_LOCALE },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: SITE_URL + OG_IMAGE },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: SITE_URL + OG_IMAGE },
      ],
      link: [{ rel: 'alternate', type: 'application/rss+xml', title: `${SITE_NAME} — Blog`, href: `${SITE_URL}/rss.xml` }],
      // Privacy-friendly analytics — injected only when configured (see site.config.js).
      script: ANALYTICS.src
        ? [{ src: ANALYTICS.src, 'data-website-id': ANALYTICS.websiteId, defer: true, async: true }]
        : [],
    })
  },
)
