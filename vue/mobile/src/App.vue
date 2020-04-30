<template>
  <div id="app">
    <template v-if="noHeaderView.includes($route.path)">
      <router-view :user.sync="user" @login="updateLoginState"></router-view>
    </template>
    <template v-else>
      <TheBaseHeader :user.sync="user"></TheBaseHeader>
      <router-view class="main" :user.sync="user"></router-view>
    </template>
  </div>
</template>

<script>
import TheBaseHeader from '@/components/TheBaseHeader';

export default {
  data() {
    return {
      noHeaderView: ['/auth'],
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

<style>
ul,
li {
  margin: 0;
  padding: 0;
}

.main {
  box-sizing: border-box;
  margin-top: 7.4rem;
  padding: 1rem 0 5rem;
  min-height: calc(100vh - 7.4rem);
  overflow: hidden;
}

.gray-bg {
  background-color: #e9ecef;
}
</style>
