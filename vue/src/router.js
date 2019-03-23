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
      component: () => import('./views/Course.vue'),
      children: [
        {
          path: '',
          name: 'all_course',
          component: () => import('./views/childrenViews/AllCourse.vue')
        },
        {
          path: '/course/:course_id',
          name: 'course_detail',
          component: () => import('./views/childrenViews/CourseDetail.vue')
        },
        {
          path: '/course/:course_id/pd',
          name: 'course_part_detail',
          component: () => import('./views/childrenViews/CoursePartDetail.vue')
        },
        {
          path: '/editCourse',
          name: 'edit_chapter',
          component: () => import('./views/childrenViews/editCourse.vue'),
        }
      ]
    },
    {
      path: '/library',
      component: () => import('./views/Library.vue'),
      children: [
        {
          path: '',
          name: 'show_resources',
          component: () => import('./views/childrenViews/Resources.vue')
        },
        {
          path: ':filename',
          name: 'preview_courseware',
          component: () => import('./views/childrenViews/PreviewCourseware.vue')
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
