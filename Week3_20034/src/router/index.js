import { createRouter, createWebHistory } from 'vue-router'
import Turn1A2 from '../components/1A_2.vue'
import Turn1A from '../components/1A.vue'
import Turn1B from '../components/1B.vue'
import Turn2A from '../components/2A.vue'
import Turn2B from '../components/2B.vue'
import Turn3A from '../components/3A.vue'
import Turn3B from '../components/3B.vue'
import Turn2Ideal from '../components/2Ideal.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/1a2',
    name: 'Turn 1A 2',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn1A2
  },
  {
    path: '/1a',
    name: 'Turn 1A',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn1A
  },
  {
    path: '/1b',
    name: 'Turn 1B',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn1B
  },
  {
    path: '/2a',
    name: 'Turn 2A',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn2A
  },
  {
    path: '/2b',
    name: 'Turn 2B',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn2B
  },
  {
    path: '/3a',
    name: 'Turn 3A',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn3A
  },
  {
    path: '/3b',
    name: 'Turn 3B',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn3B
  },
  {
    path: '/2ideal',
    name: 'Turn 2 Ideal',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Turn2Ideal
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
export {routes}