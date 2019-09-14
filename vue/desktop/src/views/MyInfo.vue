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
        <MyCourses :user="user" />
      </el-tab-pane>
      <el-tab-pane label="我的文章" name="my-articles">
        <MyArticles :user="user" />
      </el-tab-pane>
    </el-tabs>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';
import AccountConf from '../components/AccountConf';
import MyCourses from './childrenViews/MyCourses';
import MyArticles from './childrenViews/MyArticles';
export default {
  data() {
    return {
      activeName: 'account-conf'
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
    tabChange(tab, event) {}
  },
  components: {
    MainLayout,
    AccountConf,
    MyCourses,
    MyArticles
  }
};
</script>

<style lang="scss" scoped>
.el-tabs__content {
  overflow: auto;
}
</style>
