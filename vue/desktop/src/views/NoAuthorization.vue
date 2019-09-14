<template>
  <MainLayout>
    <el-row type="flex" justify="center">
      <span class="title">您没有执行该操作的权限！</span>
    </el-row>
    <el-row type="flex" justify="center">
      <el-button plain size="small" @click="$router.replace({ path: '/auth' })"
        >登录</el-button
      >
      <el-button plain size="small" @click="$router.go(-1)">返回</el-button>
    </el-row>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/MainLayout';

export default {
  components: {
    MainLayout
  }
};
</script>

<style lang="scss" scoped>
.title {
  display: block;
  margin-bottom: 20px;
  padding: 20px 0;
  font-size: 1.5rem;
  color: #f56c6c;
}
</style>
