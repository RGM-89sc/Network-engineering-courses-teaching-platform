<template>

    <router-view :user.sync="user"></router-view>

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
}
</script>

<style lang="scss" scoped>

</style>