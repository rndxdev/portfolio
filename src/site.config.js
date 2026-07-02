// Single source of truth for site-wide SEO metadata.
// ⚠️ When you move to an exact-name domain (e.g. https://ryandickinson.dev),
//    change SITE_URL below — everything else (canonical URLs, sitemap, OG tags)
//    derives from it automatically.
export const SITE_URL = 'https://rndx.dev'

export const SITE_NAME = 'Ryan Dickinson'
export const SITE_TITLE = 'Ryan Dickinson — Full-Stack Developer'
export const SITE_DESCRIPTION =
  'Ryan Dickinson is a full-stack developer from Michigan who builds open-source tools with Vue, Laravel, and C++. Explore projects, certifications, and writing.'
export const SITE_LOCALE = 'en_US'
export const OG_IMAGE = '/og-image.svg'

// Social / professional profiles — used for schema.org sameAs entity linking.
export const PROFILES = {
  github: 'https://github.com/rndxdev',
}
