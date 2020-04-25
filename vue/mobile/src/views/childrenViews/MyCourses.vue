<template>
  <div class="my-courses">
    <Card round v-for="course in courses" :key="course.courseID">
      <div class="course">
        <span
          class="course-name"
          @click="$router.push({ path: `/course/${course.courseID}` })"
        >{{course.coursename}}</span>
        <div class="manipulate">
          <md-button
            type="link"
            @click="$router.push({ path: `/myInfo/courseDetail?id=${course.courseID}` })"
          >统计信息</md-button>
        </div>
      </div>
    </Card>

    <div v-if="courses.length === 0" class="no-course">
      <span v-if="user && user.userType === 0">
        您还没有开始学习任何课程，去
        <md-button type="link" @click="$router.push({ path: '/' })">挑选课程</md-button>吧
      </span>
      <span v-if="user && user.userType === 1">
        您还没有教授任何课程，去
        <md-button type="link" @click="$router.push({ path: '/' })">开设课程</md-button>吧
      </span>
    </div>
  </div>
</template>

<script>
import Card from '../../components/Card';

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
        .get('tchGetMyCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.courses = res.data.data;
          }
          if (res.data.code === -1) {
            this.$toast.failed('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.failed('加载失败');
        });
    },
    stuGetMyCourses() {
      this.$http
        .get('stuGetMyCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.courses = res.data.data.courses;
          }
          if (res.data.code === -1) {
            this.$toast.failed('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.failed('加载失败');
        });
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.my-courses {
  padding-top: 20px;
}

.course {
  display: table;
  width: 100%;

  .course-name {
    display: table-cell;
  }

  .manipulate {
    display: table-cell;
    text-align: right;
  }
}

.no-course {
  padding: 5rem;
  text-align: center;
  color: #909090;
}
</style>