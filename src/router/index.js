import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/about', component: () => import('../pages/AboutPage.vue') },
  { path: '/projects', component: () => import('../pages/ProjectsPage.vue') },
  { path: '/blog', component: () => import('../pages/BlogPage.vue') },
  { path: '/blog/:slug', component: () => import('../pages/BlogPostPage.vue') },
  { path: '/contact', component: () => import('../pages/ContactPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
