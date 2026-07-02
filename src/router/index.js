export const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/about', component: () => import('../pages/AboutPage.vue') },
  { path: '/projects', component: () => import('../pages/ProjectsPage.vue') },
  { path: '/certifications', component: () => import('../pages/CertificationsPage.vue') },
  { path: '/blog', component: () => import('../pages/BlogPage.vue') },
  { path: '/blog/:slug', component: () => import('../pages/BlogPostPage.vue') },
  { path: '/contact', component: () => import('../pages/ContactPage.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('../pages/NotFoundPage.vue') },
]
