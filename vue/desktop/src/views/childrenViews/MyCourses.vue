<template>
  <div>
    <el-card v-for="course in courses" :key="course.courseID" class="course" shadow="hover">
      <el-row>
        <el-col :span="18" class="course-name">
          <span @click="$router.push({ path: `/course/${course.courseID}` })">{{course.coursename}}</span>
        </el-col>
        <el-col :span="6" class="manipulate">
          <el-button
            type="text"
            @click="$router.push({ path: `/myInfo/courseDetail?id=${course.courseID}` })"
          >统计信息</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row v-if="courses.length === 0" class="no-course">
      <span v-if="user && user.userType === 0">
        您还没有开始学习任何课程，去
        <el-button type="text" @click="$router.push({ path: '/' })">挑选课程</el-button>吧
      </span>
      <span v-if="user && user.userType === 1">
        您还没有教授任何课程，去
        <el-button type="text" @click="$router.push({ path: '/' })">开设课程</el-button>吧
      </span>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: []
    };
  },
  created() {
    if (this.user && this.user.userType === 1) {
      this.tchGetMyCourses();
    }
    if (this.user && this.user.userType === 0) {
      this.stuGetMyCourses();
    }
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  methods: {
    tchGetMyCourses() {
      this.$http
        .get('/api/tchGetMyCourses')
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
    },
    stuGetMyCourses() {
      this.$http
        .get('/api/stuGetMyCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.courses = res.data.data.courses;
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

.no-course {
  padding: 5rem;
  text-align: center;
  color: #909090;
}
</style>
