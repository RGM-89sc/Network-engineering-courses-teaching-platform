<template>
  <div>
    <el-card v-for="course in courses" :key="course.courseID" class="course" shadow="hover">
      <el-row>
        <el-col :span="18" class="course-name">
          <span @click="$router.push({ path: `/course/${course.courseID}` })">{{course.coursename}}</span>
        </el-col>
        <el-col :span="6" class="manipulate">
          <el-button type="text" @click="$router.push({ path: `/myInfo/courseDetail?id=${course.courseID}` })">统计信息</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
    };
  },
  created() {
    this.getMyCourses();
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  methods: {
    getMyCourses() {
      this.$http
        .get('/api/getMyCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.courses = res.data.data;
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
.course {
  margin-bottom: 20px;

  .course-name {
    span {
      line-height: 40px;
      cursor: pointer;
    }
  }

  .manipulate {
    padding-right: 20px;
    text-align: right;
  }
}
</style>
