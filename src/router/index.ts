import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import AreaView from '../views/AreasView.vue';
import ListView from '../views/ListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:areaValue',
      name: 'area',
      component: AreaView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    }
  ]
})

export default router
