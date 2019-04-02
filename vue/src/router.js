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
          component: () => import('./views/childrenViews/EditCourse.vue'),
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
      component: () => import('./views/Exercise.vue'),
      children: [
        {
          path: '',
          name: 'all_exercise',
          component: () => import('./views/childrenViews/AllExercise.vue')
        },
        {
          path: ':course_id',
          name: 'course_exercise',
          component: () => import('./views/childrenViews/CourseExercise.vue')
        },
        {
          path: ':course_id/addExercisePaper',
          name: 'add_exercise_paper',
          component: () => import('./views/childrenViews/AddExercisePaper.vue')
        },
        {
          path: ':course_id/editExercisePaper',
          name: 'edit_exercise_paper',
          component: () => import('./views/childrenViews/EditExercisePaper.vue')
        },
        {
          path: ':course_id/exercisePaper',
          name: 'show_exercise_paper',
          component: () => import('./views/childrenViews/ExercisePaper.vue')
        }
      ]
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
