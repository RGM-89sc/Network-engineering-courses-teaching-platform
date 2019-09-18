<template>
  <MainLayout>
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="tabChange"
      :lazy="true"
    >
      <el-tab-pane label="账户配置" name="account-conf">
        <AccountConf :user.sync="user"></AccountConf>
      </el-tab-pane>
      <el-tab-pane label="我的课程" name="my-courses">
        <component
          :is="coursePanel.to"
          :user="user"
          :courseID="coursePanel.courseID"
          @changeCourseComponent="changeCourseComponentHandler"
        ></component>
      </el-tab-pane>
      <el-tab-pane label="我的文章" name="my-articles">
        <MyArticles :user="user" />
      </el-tab-pane>
      <el-tab-pane
        label="我的问题"
        name="my-questions"
        v-if="user.userType === 0"
      >
        <MyQuestions :user="user" />
      </el-tab-pane>
      <!-- <el-tab-pane
        label="我的回答"
        name="my-answers"
      >
        <MyAnswers :user="user" />
      </el-tab-pane> -->
    </el-tabs>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';
import AccountConf from '../components/AccountConf';
import MyCourses from './childrenViews/MyCourses';
import MyArticles from './childrenViews/MyArticles';
import MyCourseDetail from './childrenViews/MyCourseDetail';
import MyQuestions from './childrenViews/MyQuestions';
// import MyAnswers from './childrenViews/MyAnswers';
export default {
  data() {
    return {
      activeName: 'account-conf',
      coursePanel: {
        courseID: '',
        to: 'myCourses'
      }
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   const tabName = window.sessionStorage.getItem('myInfo.tabName');
  //   next(vm => {
  //     if (typeof tabName === 'string') {
  //       vm.activeName = tabName;
  //     }
  //   });
  // },
  methods: {
    tabChange(tab, event) {
      this.coursePanel.to =
        tab.name === 'my-courses' ? 'myCourses' : this.coursePanel.to;
    },
    changeCourseComponentHandler(route) {
      const { to, from, courseID } = route;
      this.coursePanel.courseID = courseID;
      this.coursePanel.to = to;
    }
  },
  components: {
    MainLayout,
    AccountConf,
    MyCourses,
    MyArticles,
    MyCourseDetail,
    MyQuestions
  }
};
</script>

<style lang="scss" scoped>
.el-tabs__content {
  overflow: auto;
}
</style>
