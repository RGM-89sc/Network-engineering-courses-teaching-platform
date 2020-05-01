<template>
  <div class="gray-bg" style="padding-top: 0">
    <md-tabs class="tabs">
    <md-tab-pane name="account-conf" label="账户配置">
      <AccountConf :user="user" @logout="$emit('update:user', {})"></AccountConf>
    </md-tab-pane>
      <md-tab-pane label="我的课程" name="my-courses">
        <component
          :is="coursePanel.to"
          :user="user"
          :courseID="coursePanel.courseID"
          @changeCourseComponent="changeCourseComponentHandler"
        ></component>
      </md-tab-pane>
      <md-tab-pane label="我的文章" name="my-articles">
        <MyArticles :user="user" />
      </md-tab-pane>
      <md-tab-pane
        label="我的问题"
        name="my-questions"
        v-if="user.userType === 0"
      >
        <MyQuestions :user="user" />
      </md-tab-pane>
  </md-tabs>
  </div>
</template>

<script>
import AccountConf from '../components/AccountConf';
import MyCourses from './childrenViews/MyCourses';
import MyArticles from './childrenViews/MyArticles';
import MyCourseDetail from './childrenViews/MyCourseDetail';
import MyQuestions from './childrenViews/MyQuestions';
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
  //     if (tabName) {
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
    AccountConf,
    MyCourses,
    MyArticles,
    MyCourseDetail,
    MyQuestions
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  padding-top: 0;
}
</style>
