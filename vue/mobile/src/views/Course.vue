<template>
    <router-view :user="user"></router-view>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
