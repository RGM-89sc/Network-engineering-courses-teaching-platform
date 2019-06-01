<template>
  <header>
    <div class="header">
      <span class="logo" @click="$router.push({ path: '/' })">
        <img src="../assets/logo2.png" alt="logo">
      </span>
      <span v-if="!user.id" class="user" @click="$router.push({ path: '/auth' })">登录 / 注册</span>
      <span v-else>
        <img
          class="avatar"
          :src="$serverBaseUrl + user.avatar"
          @click="$router.push({ path: '/myInfo' })"
        >
      </span>
    </div>
    <nav class="tab-bar">
      <span
        class="tab-bar-item"
        :class="{ 'is-active': item.path === currentPath }"
        v-for="item in items"
        :key="item.name"
        @click="tabChange(item)"
      >{{item.label}}</span>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      currentPath: '/',
      items: [
        { id: 1, label: '课程', path: '/' },
        { id: 2, label: '教学资源', path: '/library' },
        { id: 3, label: '作业练习', path: '/exercise' },
        { id: 4, label: '考试', path: '/exam' },
        { id: 5, label: '答疑', path: '/qa' }
      ]
    };
  },
  props: {
    user: {
      type: Object
    }
  },
  created() {
    this.routerChange();
  },
  watch: {
    '$route.path': function() {
      this.routerChange();
    }
  },
  methods: {
    routerChange() {
      let path = this.$route.path.replace(/(\/[^\/]+)(\/.+$)/, '$1');
      this.updateCurrentPath(path);
      this.judgeCookieExpired(path);
    },
    updateCurrentPath(path) {
      if (path === '/course') {
        path = '/';
      }
      this.currentPath = path;
    },
    judgeCookieExpired(path) {
      // 检测到跳转到了auth并且cookie已过期，更新user数据
      if (path === '/auth' && !this.$getLoginState()) {
        this.$emit('update:user', {});
        window.sessionStorage.removeItem('user.userType');
      }
    },
    tabChange(item) {
      this.$router.push({ path: item.path });
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
}

.header {
  box-sizing: border-box;
  padding: 10px 1rem;
  height: 3.8rem;
  overflow: hidden;

  .logo {
    float: left;
    height: calc(3.8rem-20px);

    img {
      height: 100%;
    }
  }

  .user {
    float: right;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: #409eff;
    background-color: #eef6ff;
    border-radius: 1.5rem;
  }

  .avatar {
    box-sizing: border-box;
    float: right;
    width: calc(3.8rem-20px);
    object-fit: cover;
    vertical-align: middle;
    border: 1px solid #ddd;
    border-radius: 50%;
  }
}

.tab-bar {
  box-sizing: border-box;
  height: 3.6rem;
  white-space: nowrap;
  overflow-x: auto;
  border-bottom: 1px solid #eee;

  .tab-bar-item {
    display: inline-block;
    box-sizing: border-box;
    padding: 1rem 1.2rem;
    white-space: nowrap;
    color: #606266;
    border-bottom: 4px solid transparent;
    transition: all 0.2s ease;
  }

  .is-active {
    color: #409eff;
    border-bottom: 4px solid #409eff;
    transition: all 0.5s ease;
  }
}
</style>
