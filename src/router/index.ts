import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/ride-list',
      name: 'ride-list',
      component: () => import('../views/RideView.vue'),
    },
    {
      path: '/action-panel',
      name: 'action-panel',
      component: () => import('../views/ActionView.vue'),
    },
    {
      path: '/PageNotFound',
      name: 'PageNotFound',
      component: () => import('../views/PageNotFoundView.vue')
    },
    {
      path: "/:catchAll(.*)",
      redirect: () => {
        return '/PageNotFound';
      }
    },
  ]
})

export default router
