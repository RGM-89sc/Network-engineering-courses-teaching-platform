<template>
  <div id="auth">
    <div class="auth-header">
      <md-icon name="close" size="lg" @click.once="$router.go(-1)"></md-icon>
    </div>
    <component :is="currentTab" @login="updateLoginState" @changeTab="changeTab"></component>
  </div>
</template>

<script>
import Login from '@/views/childrenViews/Login';
import Register from '@/views/childrenViews/Register';

export default {
  name: 'auth',
  data(){
    return {
      currentTab: 'Login'
    }
  },
  computed: {
    currentTabTitle () {
      return this.currentTab === 'Login' ? '登录' : '注册';
    }
  },
  created() {
    if (!this.$getLoginState()) {
      this.$emit('update:user', {});
    }
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab;
    },
    updateLoginState (user) {
      this.$emit('login', user);
    }
  },
  components: {
    Login,
    Register
  }
};
</script>

<style lang="scss" scoped>
.auth-header {
  margin: 1rem 1.2rem 3rem;
}
</style>
