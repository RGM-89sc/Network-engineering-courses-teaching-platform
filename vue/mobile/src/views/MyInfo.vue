<template>
  <div class="gray-bg" style="padding-top: 0">
    <md-tabs class="tabs">
    <md-tab-pane name="account-conf" label="账户配置">
      <AccountConf :user="user" @logout="$emit('update:user', {})"></AccountConf>
    </md-tab-pane>
    <md-tab-pane name="my-courses" label="我的课程">
      <router-view :user="user"></router-view>
    </md-tab-pane>
  </md-tabs>
  </div>
</template>

<script>
import AccountConf from '../components/AccountConf';

export default {
  data() {
    return {};
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
  components: {
    AccountConf
  }
};
</script>

<style lang="scss" scoped>
.gray-bg {
  background-color: rgb(240, 240, 240);
}

.tabs {
  padding-top: 0;
}
</style>
