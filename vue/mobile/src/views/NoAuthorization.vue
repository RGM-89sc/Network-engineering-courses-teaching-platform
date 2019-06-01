<template>
  <div>
    <span class="title">您没有执行该操作的权限！</span>
    <div class="control">
      <md-button plain size="small" inline @click="$router.replace({ path: '/auth' })">登录</md-button>
      <md-button plain size="small" inline @click="$router.go(-1)">返回</md-button>
    </div>
  </div>
</template>

<script>

export default {

};
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 5rem 0 3rem;
  text-align: center;
  font-size: 1.5rem;
  color: #f56c6c;
}

.control {
  text-align: center;

  .md-button {
    margin: 0 5px;
  }
}
</style>
