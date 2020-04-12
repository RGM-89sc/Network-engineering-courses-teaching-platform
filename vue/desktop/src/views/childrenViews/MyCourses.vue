<template>
  <div>
    <el-card
      v-for="course in courses"
      :key="course.courseID"
      class="course"
      shadow="always"
    >
      <el-row>
        <el-col :span="18" class="course-name">
          <span @click="$router.push({path: `/course/${course.courseID}/index`})">{{
            course.coursename
          }}</span>
        </el-col>
        <el-col :span="6" class="manipulate">
          <el-button
            type="text"
            @click="
              $emit('changeCourseComponent', {
                from: 'myCourses',
                to: 'myCourseDetail',
                courseID: course.courseID
              })
            "
            >统计信息</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-row v-if="courses.length === 0" class="no-course">
      <span v-if="user && user.userType === 0">
        您还没有开始学习任何课程，去
        <el-button type="text" @click="$router.push({path: '/course'})"
          >挑选课程</el-button
        >吧
      </span>
      <span v-if="user && user.userType === 1">
        您还没有教授任何课程，去
        <el-button type="text" @click="$router.push({path: '/course'})"
          >开设课程</el-button
        >吧
      </span>
    </el-row>
  </div>
</template>

<script>
import {CoursesProvider} from '@/provider/index';
import {UserProvider} from '@/provider/index';
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
      UserProvider.teacher
        .getMyCourses()
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.courses = res.data.data;
            console.log(this.courses);
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
      UserProvider.student
        .getMyCourses()
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
