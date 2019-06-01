<template>
  <router-view :user="user"></router-view>
</template>

<script>
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
};
</script>

<style lang="scss" scoped>
</style>
