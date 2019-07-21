<template>
  <div class="qa">
    <el-row type="flex"
      ><el-col :span="5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/qa' }"
            >问题列表</el-breadcrumb-item
          >
          <el-breadcrumb-item v-show="canBreadCrumbItemShow"
            >问题详情</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col></el-row
    >
    <el-divider></el-divider>
    <el-row type="flex" align="middle" justify="center">
      <el-col> <router-view :user.sync="user"></router-view> </el-col
    ></el-row>
  </div>
</template>

<script>
export default {
  name: 'qa',
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  computed: {
    canBreadCrumbItemShow() {
      return this.$route.name === 'qa_question' ? true : false;
    }
  }
};
</script>

<style lang="scss" scoped>
.qa {
  width: 1100px;
  margin: 0 auto;
}
</style>
