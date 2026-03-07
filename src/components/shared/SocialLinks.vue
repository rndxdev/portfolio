<template>
  <div class="flex items-center gap-5">
    <a
      v-for="link in socials"
      :key="link.label"
      :href="link.href"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      class="text-muted hover:text-text transition-colors"
      :aria-label="link.label"
    >
      <svg class="w-5 h-5" v-bind="link.svgAttrs" aria-hidden="true">
        <path v-bind="link.pathAttrs" />
      </svg>
    </a>
  </div>
</template>

<script setup>
const socials = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/rndx_dev',
    external: true,
    svgAttrs: { fill: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  },
  {
    label: 'GitHub',
    href: 'https://github.com/rndxdev',
    external: true,
    svgAttrs: { fill: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: { d: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
  },
  {
    label: 'Email hello@rndx.dev',
    href: 'mailto:hello@rndx.dev',
    external: false,
    svgAttrs: { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    pathAttrs: { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  },
]
</script>
