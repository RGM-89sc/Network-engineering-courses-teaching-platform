<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="12">
      <router-view :user="user"></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
