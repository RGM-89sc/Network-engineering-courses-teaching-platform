<template>
  <div id="app">
    <TheBaseHeader :user.sync="user" />

    <el-main @login="updateLoginState">
      <transition name="slide-fade" mode="out-in">
        <router-view :user.sync="user"></router-view>
      </transition>
    </el-main>
  </div>
</template>

<script>
import TheBaseHeader from '@/components/TheBaseHeader';

export default {
  name: 'home',
  data() {
    return {
      user: {}
    };
  },
  created() {
    this.$router.addRoutes([
      {
        path: '/noAuthorization',
        name: 'no_authorization',
        component: () => import('./views/NoAuthorization.vue')
      },
      {
        path: '*',
        name: '404',
        component: () => import('./views/404.vue')
      }
    ]);

    this.user = this.$getLoginState() || {};
  },
  methods: {
    updateLoginState(user) {
      this.user = user;
    }
  },
  components: {
    TheBaseHeader
  }
};
</script>


<style lang="scss">
body {
  margin: 0;
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  //transform: translateX(50px);
  opacity: 0;
}
</style>
