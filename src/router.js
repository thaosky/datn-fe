import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import TestIndex from './views/tests/index.vue'
import EmptyHeader from '@/layout/empty/EmptyHeader.vue'
import EmptyFooter from '@/layout/empty/EmptyFooter.vue'
import AppHeader from "@/layout/AppHeader.vue";
import AppFooter from "@/layout/AppFooter.vue";

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'components',
      components: {
        header: EmptyHeader,
        default: Home,
        footer: EmptyFooter
      }
    },
    {
      path: '/tests',
      name: 'tests',
      components: {
        header: AppHeader,
        default: TestIndex,
        footer: AppFooter
      }
    },
    {
      path: '/tests/create',
      name: 'tests.create',
      components: {
        header: AppHeader,
        default: () => import('@/views/tests/create.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/tests/:id/edit',
      name: 'tests.edit',
      components: {
        header: AppHeader,
        default: () => import('@/views/tests/edit.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/tests/:id',
      name: 'tests.detail',
      components: {
        header: AppHeader,
        default: () => import('@/views/tests/detail.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/tests/:id/start',
      name: 'tests.start',
      components: {
        header: AppHeader,
        default: () => import('@/views/tests/start.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/questions',
      name: 'questions',
      components: {
        header: AppHeader,
        default: () => import('@/views/questions/index.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/tags',
      name: 'tags',
      components: {
        header: AppHeader,
        default: () => import('@/views/tags/index.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: EmptyHeader,
        default: Login,
        footer: EmptyFooter
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: EmptyHeader,
        default: Register,
        footer: EmptyFooter
      }
    },
    {
      path: '/users',
      name: 'users',
      components: {
        header: AppHeader,
        default: () => import('@/views/users/index.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/achievements',
      name: 'achievements',
      components: {
        header: AppHeader,
        default: () => import('@/views/achievements/index.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/users/profile',
      name: 'user-profile',
      components: {
        header: AppHeader,
        default: () => import('@/views/users/Profile.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/users/profile/change-password',
      name: 'user-password',
      components: {
        header: AppHeader,
        default: () => import('@/views/users/Password.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/statistics',
      name: 'statistics',
      components: {
        header: AppHeader,
        default: () => import('@/views/statistics/index.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/statistics/my-results',
      name: 'statistics.my-results',
      components: {
        header: AppHeader,
        default: () => import('@/views/statistics/my-results.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/statistics/quiz/:id',
      name: 'statistics.test',
      components: {
        header: AppHeader,
        default: () => import('@/views/statistics/quiz.vue'),
        footer: AppFooter
      }
    },
    {
      path: '/statistics/:id',
      name: 'statistics-detail',
      components: {
        header: AppHeader,
        default: () => import('@/views/statistics/detail.vue'),
        footer: AppFooter
      }
    },
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  }
})
