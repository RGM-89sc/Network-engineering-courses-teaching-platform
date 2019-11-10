import Vue from 'vue';
import Router from 'vue-router';
import getLoginState from './getLoginState';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('./views/Auth.vue'),
      meta: {
        title: '登录&注册'
      }
    },
    {
      path: '/',
      component: () => import('./views/Course.vue'),
      children: [
        {
          path: '',
          name: 'all_course',
          component: () => import('./views/childrenViews/AllCourse.vue'),
          meta: {
            title: 'NCW'
          }
        },
        {
          path: '/course/:course_id',
          name: 'course_detail',
          component: () => import('./views/childrenViews/CourseDetail.vue'),
          meta: { 
            auth: 'all',
            title: '课程详情'
          }
        },
        {
          path: '/course/:course_id/pd',
          name: 'course_part_detail',
          component: () => import('./views/childrenViews/CoursePartDetail.vue'),
          meta: { 
            auth: 'all',
            title: '课程内容'
          }
        },
        // {
        //   path: '/editCourse',
        //   name: 'edit_chapter',
        //   component: () => import('./views/childrenViews/EditCourse.vue'),
        //   meta: { 
        //     auth: 'tch',
        //     title: '编辑课程'
        //   }
        // }
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
          meta: {
            title: '全部资源'
          }
        },
        {
          path: ':classify/:filename',
          name: 'preview_courseware',
          component: () => import('./views/childrenViews/PreviewCourseware.vue'),
          meta: {
            title: '资源预览'
          }
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
          component: () => import('./views/childrenViews/AllExercise.vue'),
          meta: {
            title: '全部作业'
          }
        },
        {
          path: ':course_id',
          name: 'course_exercise',
          component: () => import('./views/childrenViews/CourseExercise.vue'),
          meta: {
            title: '课程作业'
          }
        },
        // {
        //   path: ':course_id/addExercisePaper',
        //   name: 'add_exercise_paper',
        //   component: () => import('./views/childrenViews/AddExercisePaper.vue'),
        //   meta: { 
        //     auth: 'tch',
        //     title: '添加作业'
        //   }
        // },
        // {
        //   path: ':course_id/editExercisePaper',
        //   name: 'edit_exercise_paper',
        //   component: () => import('./views/childrenViews/EditExercisePaper.vue'),
        //   meta: { 
        //     auth: 'tch',
        //     title: '编辑作业'
        //   }
        // },
        {
          path: ':course_id/exercisePaper',
          name: 'show_exercise_paper',
          component: () => import('./views/childrenViews/ExercisePaper.vue'),
          meta: {
            title: '作业练习'
          }
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
          component: () => import('./views/childrenViews/AllExam.vue'),
          meta: {
            title: '全部考试'
          }
        },
        {
          path: ':course_id',
          name: 'course_exam',
          component: () => import('./views/childrenViews/CourseExam.vue'),
          meta: {
            title: '课程考试'
          }
        },
        // {
        //   path: ':course_id/addExamPaper',
        //   name: 'add_exam_paper',
        //   component: () => import('./views/childrenViews/AddExamPaper.vue'),
        //   meta: { 
        //     auth: 'tch',
        //     title: '添加考试'
        //   }
        // },
        {
          path: ':course_id/examPaper',
          name: 'show_exam_paper',
          component: () => import('./views/childrenViews/ExamPaper.vue'),
          meta: { 
            auth: 'all',
            title: '考试'
          }
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
      component: () => import('./views/MyInfo.vue'),
      meta: { auth: 'all' },
      children: [
        {
          path: '',
          name: 'my_courses',
          component: () => import('./views/childrenViews/MyCourses.vue'),
          meta: {
            title: '我的信息'
          }
        },
        {
          path: 'courseDetail',
          name: 'my_course_detail',
          component: () => import('./views/childrenViews/MyCourseDetail.vue'),
          meta: { 
            auth: 'all',
            title: '我的课程详情'
          },
        }
      ]
    },
    {
      path: '/emptyPage',
      name: 'empty_page',
      component: () => import('./views/EmptyPage.vue')
    }
  ]
});

// 路由鉴权
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    const loginState = getLoginState() || {};
    const userType = loginState.userType;
    if (to.meta.auth === 'all') {
      if (userType !== 0 && userType !== 1) {
        return next({ path: '/auth' });  // 登录界面
      }
    } else if (to.meta.auth === 'tch') {
      if (!userType) {
        return next({ path: '/auth' });  // 登录界面
      }
      if (userType !== 1) {
        return next({ path: '/noAuthorization' });
      }
    } else if (to.meta.auth === 'stu') {
      if (!userType) {
        return next({ path: '/auth' });  // 登录界面
      }
      if (userType !== 0) {
        return next({ path: 'noAuthorization' });
      }
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;