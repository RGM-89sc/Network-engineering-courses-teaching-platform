<template>
  <div>
    <el-row class="title">
      <span>请选择以下课程：</span>
    </el-row>
    <el-row>
      <el-row v-for="course in allCourses" :key="course.courseID">
        <el-card>
          <span
            class="course-name"
            @click="gotoCourseExam(course.courseID, course.coursename)"
            >{{ course.coursename }}</span
          >
          <span class="course-tch">授课教师：{{ course.tch[0].username }}</span>
        </el-card>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import {CoursesProvider} from '@/provider/index';
export default {
  data() {
    return {
      allCourses: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    CoursesProvider.getCourses()
      .then(res => {
        if (res.data.code === 1) {
          this.allCourses = res.data.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    gotoCourseExam(courseID, coursename) {
      window.sessionStorage.setItem('exams.current_coursename', coursename);
      this.$router.push({path: `/exam/${courseID}`});
      console.log(this.$route.params);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 20px;
}
.course-name {
  display: block;
  margin-bottom: 10px;
  font-size: 1.1rem;
  cursor: pointer;
}
.course-tch {
  font-size: 0.8rem;
  color: #606266;
}
</style>
