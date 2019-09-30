<template>
  <MainLayout class="homepage">
    <el-carousel height="50vh">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row type="flex" class="course-list__wrapper" justify="space-between">
      <div
        v-for="(course, index) in courses"
        :key="index"
        class="course-item__wrapper"
        @click="
          $router.push({
            path: `/course/${course.courseID}`
          })
        "
      >
        <el-card class="course__item_hottest">
          <div class="course-cover__wrapper">
            <img
              :src="course.cover"
              :alt="course.coursename"
              :title="course.coursename"
              @click.prevent=""
            />
          </div>
          <div class="course-info__wrapper">
            <p class="course_tch-name">{{ course.tchID }}</p>
            <p :title="course.coursename" class="course_course-name">
              {{ course.coursename }}
            </p>
          </div>
        </el-card>
      </div>
    </el-row>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout';
export default {
  data() {
    return {
      carouselItems: [],
      courses: []
    };
  },
  components: {
    MainLayout
  },
  methods: {
    getFourCourses() {
      this.$http
        .get('/api/getFourHottestCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.courses = res.data.data;
            console.log(this.courses);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    }
  },
  created() {
    this.getFourCourses();
  }
};
</script>

<style lang="scss">
.course-list__wrapper {
  cursor: pointer;
}

.course__item_hottest {
  > .el-card__body {
    display: flex;
    flex-direction: row;
    padding-right: 0;
  }
}
.course-item__wrapper {
  box-sizing: border-box;
  padding: 0 20px;
  width: 25%;
}
.course-cover__wrapper {
  padding-right: 12px;
  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }
}
.course-info__wrapper {
  overflow: hidden;

  > p {
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
}
</style>