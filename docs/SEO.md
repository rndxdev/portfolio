# SEO — ranking for "Ryan Dickinson"

Goal: own the search query for **people looking for you** (e.g. "Ryan Dickinson
developer"), and — once Google links the entity to this site — the bare name.
You won't outrank unrelated famous namesakes; that's fine, it's not the target.

## Done in code (ships on next deploy)

| Item | What | Where |
| --- | --- | --- |
| 1. Prerendering | Every route builds to real static HTML (`vite-ssg`), so crawlers and social scrapers see full content, not an empty JS shell. | `package.json` (`vite-ssg build`), `vite.config.js` |
| 2. Per-route meta | Unique `<title>`, description, canonical, Open Graph + Twitter tags per page. | `src/composables/useSeo.js`, called in every page |
| 2. Structured data | `Person` + `WebSite` JSON-LD on the home page; `BlogPosting` on each post. | `src/pages/HomePage.vue`, `src/pages/BlogPostPage.vue` |
| 2. Share image | Branded 1200×630 card. | `public/og-image.svg` |
| 5. Sitemap/robots | `sitemap.xml` + `robots.txt` generated at build from all routes + blog slugs. | `vite.config.js` (`vite-plugin-sitemap`) |

**One knob controls all absolute URLs:** `SITE_URL` in `src/site.config.js`.
Change it when the domain changes (see item 4) and canonical/OG/sitemap all follow.

### Recommended upgrade
`public/og-image.svg` renders on Discord/Slack/Telegram but **LinkedIn and X ignore
SVG**. Replace it with a `og-image.png` (1200×630) and set `OG_IMAGE` in
`src/site.config.js` to `/og-image.png`. (Export the SVG to PNG, or ask me to
generate one once an image tool is available.)

## Needs your action

### 4. Exact-name domain (highest external lever)
- Register **ryandickinson.dev** (or `.com`). An exact-name domain ranks noticeably
  better for a name query than `rndx.dev`.
- Point it at Netlify, set it as the **primary** domain, and 301-redirect the old
  one so ranking signals consolidate.
- Update `SITE_URL` in `src/site.config.js` to the new origin.

### 5. Google Search Console
1. Go to https://search.google.com/search-console and add the property (Domain type).
2. Verify via DNS TXT record (Netlify DNS makes this easy).
3. Submit `https://<your-domain>/sitemap.xml`.
4. Use **URL Inspection → Request indexing** on the home + about pages to speed up
   first crawl.
5. Repeat verification with **Bing Webmaster Tools** (free, and feeds other engines).

### 3. Cross-link your profiles (`sameAs` consistency)
Google builds a person's identity from profiles that point at each other with a
consistent name + role.
- Add the site URL to the bio/links of: **GitHub, LinkedIn, X/Twitter, dev.to**, and
  anywhere else you post.
- Use the same display name ("Ryan Dickinson") and title ("Full-Stack Developer").
- Then add each profile URL to `PROFILES` in `src/site.config.js` — they're emitted
  as `sameAs` in the Person schema, closing the loop.

### 6. Keep publishing
Each blog post under your name adds a page that resolves to "you" and builds topical
authority. Posts are already prerendered with `BlogPosting` schema and a byline.

## After deploy — verify
- **Rich Results Test:** https://search.google.com/test/rich-results — paste your URL,
  confirm the `Person` / `BlogPosting` items are detected.
- **Social preview:** paste a URL into https://www.opengraph.xyz to see the card.
- **View source** on any page: the title, description, and content should be present
  in the raw HTML (not injected only by JS).
