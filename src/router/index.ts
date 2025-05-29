import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stations',
    name: 'Stations',
    component: () => import('../views/stations/StationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/new',
    name: 'NewStation',
    component: () => import('../views/stations/StationFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/:id/edit',
    name: 'EditStation',
    component: () => import('../views/stations/StationFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/map/:stationId?',
    name: 'Map',
    component: () => import('../views/MapView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  
  // Routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
  // Routes for guests only (like login)
  else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Dashboard' });
  } 
  // All other routes
  else {
    next();
  }
});

export default router;