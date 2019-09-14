<template>
  <el-card shadow="always">
    <div slot="header">
      <span>学习该课程的学生</span>
    </div>
    <el-row class="stus-box">
      <el-row v-if="stus.length === 0">
        <span class="no-stus">暂无学生学习该课程</span>
      </el-row>
      <el-row v-if="stus.length > 0">
        <el-col :span="6" v-for="stu in stus.slice(0, 4)" :key="stu.id">
          <img :src="stu.avatar" alt class="stu-avatar" :title="stu.username" />
        </el-col>
      </el-row>
      <el-row v-if="stus.length > 4">
        <el-col :span="6" v-for="stu in stus.slice(4, 8)" :key="stu.id">
          <img :src="stu.avatar" alt class="stu-avatar" :title="stu.username" />
        </el-col>
      </el-row>
      <el-row class="see-all-stus" v-if="stus.length > 8">
        <el-button type="text" @click="checkingAllStu = true"
          >查看全部</el-button
        >
      </el-row>
    </el-row>
    <el-dialog
      title="学习该课程的学生"
      :visible.sync="checkingAllStu"
      width="30%"
      v-if="stus.length > 8"
    >
      <div>
        <img
          v-for="stu in stus"
          :key="stu.id"
          :src="stu.avatar"
          alt
          class="stu-avatar"
          :title="stu.username"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkingAllStu = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      checkingAllStu: false
    };
  },
  props: {
    stus: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.stus-box {
  text-align: center;

  .no-stus {
    display: block;
    padding: 10px;
    font-size: 0.9rem;
    color: #909090;
  }

  .see-all-stus {
    text-align: center;
  }
}

.stu-avatar {
  display: inline-block;
  margin-bottom: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee;
}
</style>
