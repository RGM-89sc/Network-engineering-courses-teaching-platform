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
          component: () => import('./views/childrenViews/CourseDetail.vue'),
          meta: { auth: 'all' }
        },
        {
          path: '/course/:course_id/pd',
          name: 'course_part_detail',
          component: () => import('./views/childrenViews/CoursePartDetail.vue'),
          meta: { auth: 'all' }
        },
        {
          path: '/editCourse',
          name: 'edit_chapter',
          component: () => import('./views/childrenViews/EditCourse.vue'),
          meta: { auth: 'tch' }
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
          component: () => import('./views/childrenViews/Resources.vue'),
          meta: { auth: 'all' }
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
          component: () => import('./views/childrenViews/AddExercisePaper.vue'),
          meta: { auth: 'tch' }
        },
        {
          path: ':course_id/editExercisePaper',
          name: 'edit_exercise_paper',
          component: () => import('./views/childrenViews/EditExercisePaper.vue'),
          meta: { auth: 'tch' }
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
      component: () => import('./views/Exam.vue'),
      children: [
        {
          path: '',
          name: 'all_exam',
          component: () => import('./views/childrenViews/AllExam.vue')
        },
        {
          path: ':course_id',
          name: 'course_exam',
          component: () => import('./views/childrenViews/CourseExam.vue')
        },
        {
          path: ':course_id/addExamPaper',
          name: 'add_exam_paper',
          component: () => import('./views/childrenViews/AddExamPaper.vue'),
          meta: { auth: 'tch' }
        },
        {
          path: ':course_id/examPaper',
          name: 'show_exam_paper',
          component: () => import('./views/childrenViews/ExamPaper.vue'),
          meta: { auth: 'all' }
        }
      ]
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('./views/Qa.vue')
    },
    {
      path: '/myInfo',
      name: 'my_info',
      component: () => import('./views/MyInfo.vue')
    },
    {
      path: '/emptyPage',
      name: 'empty_page',
      component: () => import('./views/EmptyPage.vue')
    }
  ]
});
