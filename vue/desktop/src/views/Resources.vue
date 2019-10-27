<template>
  <!-- <MainLayout> -->
    <router-view :user="user"></router-view>
  <!-- </MainLayout> -->
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
};
</script>

<style lang="scss" scoped>
</style>
