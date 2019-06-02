<template>
  <el-header>
    <router-link to="/">
      <img class="logo" src="../assets/logo2.png" alt="logo">
    </router-link>
    <el-menu
      :default-active="path"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
      ref="menu"
    >
      <el-menu-item index="/">课程</el-menu-item>
      <el-menu-item index="/library">教学资源</el-menu-item>
      <el-menu-item index="/exercise">作业练习</el-menu-item>
      <el-menu-item index="/exam">考试</el-menu-item>
      <el-menu-item index="/qa">答疑</el-menu-item>
      <el-menu-item index="/auth" v-if="!user.id">登录/注册</el-menu-item>
      <el-dropdown v-else trigger="click" @command="userCommand">
        <span class="el-dropdown-link">
          <img class="avatar" :src="$serverBaseUrl + user.avatar">
          {{user.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="getOwnInfo">我的信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  name: 'baseHeader',
  data() {
    return {
      path: ''
    };
  },
  props: {
    user: {
      type: Object
    }
  },
  created() {},
  mounted() {
    this.path = '/';
  },
  watch: {
    '$route.path': function() {
      let path = this.$route.path.replace(/(\/[^\/]+)(\/.+$)/, '$1');
      if (path === '/course') {
        path = '/';
      }
      this.path = path;
      this.$refs.menu.activeIndex = path;

      // 检测到跳转到了auth并且cookie已过期，更新user数据
      if (path === '/auth' && !this.$getLoginState()) {
        this.$emit('update:user', {});
      }
    }
  },
  methods: {
    logout() {
      let url;

      if (this.user.userType === 0) {
        url = '/api/stuLogout';
      } else {
        url = '/api/tchLogout';
      }

      this.$http
        .get(url)
        .then(res => {
          if (res.data.code === 1) {
            this.$emit('update:user', {});
            this.$router.push({ path: '/' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    userCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
      if (command === 'getOwnInfo') {
        this.$router.push({ path: '/myInfo' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  border-bottom: 1px solid #ddd;
  overflow: hidden;

  .logo {
    height: 100%;
  }

  .el-menu {
    float: right;
  }

  .el-dropdown {
    padding-left: 20px;
    line-height: 60px;
    border-left: 1px solid #ddd;

    .el-dropdown-link {
      cursor: pointer;
    }
  }

  .avatar {
    margin-right: 10px;
    width: 32px;
    height: 32px;
    object-fit: cover;
    vertical-align: middle;
    border-radius: 50%;
  }
}
</style>
