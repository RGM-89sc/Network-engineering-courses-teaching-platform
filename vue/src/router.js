import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('./views/Auth.vue')
    },
    {
      path: '/',
      name: 'course',
      component: () => import('./views/Course.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('./views/Library.vue')
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: () => import('./views/Exercise.vue')
    },
    {
      path: '/exam',
      name: 'exam',
      component: () => import('./views/Exam.vue')
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('./views/Qa.vue')
    },
  ]
});
