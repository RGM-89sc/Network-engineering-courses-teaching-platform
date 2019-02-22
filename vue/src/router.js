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
      component: () => import('./views/Library.vue'),
      children: [
        {
          path: '',
          name: 'show_resources',
          component: () => import('./components/Resources.vue')
        },
        {
          path: ':filename',
          name: 'preview_courseware',
          component: () => import('./components/PreviewCourseware.vue')
        }
      ]
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
    {
      path: '/myInfo',
      name: 'myInfo',
      component: () => import('./views/MyInfo.vue')
    },
    {
      path: '/emptyPage',
      name: 'emptyPage',
      component: () => import('./views/EmptyPage.vue')
    }
  ]
});
