<template>
  <div>
    <el-row>
      <span>
        <i class="el-icon-arrow-left icon" title="返回" @click="$router.go(-1)"></i>统计信息 - {{courseName}}
      </span>
    </el-row>
    <el-row></el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseID: '',
      courseName: '',
      stus: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.courseID = this.$route.query.id;
    this.getCourseStus();
  },
  methods: {
    getCourseStus() {
      this.$http
        .post('/api/getCourseStus', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.courseName = res.data.data.coursename;
            this.stus = res.data.data.stus;
            console.log(res.data.data);
          }
          if (res.data.code === -1) {
            this.$message.error('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error('加载失败');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 10px;
  padding: 5px;
  font-weight: bold;
  color: #409eff;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgb(250, 250, 250);
  }
}
</style>
