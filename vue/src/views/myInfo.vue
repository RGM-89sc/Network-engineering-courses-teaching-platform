<template>
  <MainLayout :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
    <span>我的信息</span>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';

export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  components: {
    MainLayout
  }
}
</script>

<style lang="scss" scoped>

</style>
