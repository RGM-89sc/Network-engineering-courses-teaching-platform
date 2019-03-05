<template>
  <div class="bigCon">
    <div class="con">
      <p class="notf">404 Not Found</p>
      <p class="mes">This is not the web page you are looking for.</p>
      <el-button type="primary" @click="$router.push({ path: '/' })">
        返回首页
        <i class="el-icon-d-arrow-right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.bigCon {
  width: 100%;
}
.con {
  padding: 0 10% 0;
  width: 80%;
  height: 65%;
}
.notf {
  font-size: 85px;
  font-weight: bolder;
	color: #409EFF;
}
.mes {
  margin: 20px 0 80px;
  font-size: 38px;
	color: #606266;
}
</style>
