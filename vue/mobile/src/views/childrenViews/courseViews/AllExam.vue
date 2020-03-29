<template>
  <div class="gray-bg">
    <Card round>
      <div class="header">
        <span class="title">请选择以下课程：</span>
      </div>

      <div class="no-courses" v-if="allCourses.length === 0">
        <span>暂无数据</span>
      </div>

      <md-cell-item
        v-for="course in allCourses"
        :key="course.courseID"
        :title="course.coursename"
        arrow
        :brief="'授课教师：' + course.tch[0].username"
        @click="gotoCourseExam(course.courseID, course.coursename)"
      />
    </Card>
  </div>
</template>

<script>
import Card from '../../components/Card';

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
    this.$http
      .get('/api/getCourses')
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
      this.$router.push({ path: `/exam/${courseID}` });
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: table;
  width: 100%;

  .title {
    display: table-cell;
  }

  .tool-bar {
    display: table-cell;
    text-align: right;
  }
}

.no-courses {
  margin: 5rem 0;
  text-align: center;
  color: #606266;
}
</style>
