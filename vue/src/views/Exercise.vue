<template>
  <MainLayout>
    <span>作业练习</span>
    <router-view :user="user"></router-view>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';

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
  components: {
    MainLayout
  }
};
</script>

<style lang="scss" scoped>
// 如果是教师权限，可以进入编辑试卷、新增试卷的入口
// 试卷包含的属性：科目、单元、题目列表（包含答案及解析）
</style>
