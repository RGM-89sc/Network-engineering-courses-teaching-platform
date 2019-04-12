<template>
  <MainLayout>
    <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
      <el-tab-pane label="账户配置" name="account-conf">
        <AccountConf :user="user"></AccountConf>
      </el-tab-pane>
      <el-tab-pane label="我的课程" name="my-courses">
        <router-view :user="user"></router-view>
      </el-tab-pane>
    </el-tabs>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';
import AccountConf from '../components/AccountConf';

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
  beforeRouteEnter(to, from, next) {
    const tabName = window.sessionStorage.getItem('myInfo.tabName');
    next(vm => {
      if (tabName) {
        vm.activeName = tabName;
      }
    });
  },
  methods: {
    tabChange(tab, event) {
      window.sessionStorage.setItem('myInfo.tabName', tab.name);
    }
  },
  components: {
    MainLayout,
    AccountConf
  }
};
</script>

<style lang="scss" scoped>
</style>
