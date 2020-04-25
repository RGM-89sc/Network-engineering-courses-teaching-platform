<template>
  <div class="course">
    <div class="cover">
      <img :src="$serverBaseUrl + course.cover" style="width: 100%;">
    </div>
    <div>
      <span class="title">{{course.coursename}}</span>
      <span class="teacher">教师：{{course.tch[0].username}}</span>
      <div class="control">
        <md-button type="link" class="button" @click="$router.push({ path: `/course/${course.courseID}` })">进入课程</md-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style lang="scss" scoped>
.course {
  position: relative;

  .cover {
    margin-bottom: 10px;
    width: 100%;
    height: 20vh;
    overflow: hidden;
    background-color: #efefef;
  }

  .title {
    display: block;
    padding-top: 10px;
    text-align: center;
    font-size: 1.1rem;
    color: #222;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .teacher {
    display: block;
    padding: 10px 0 15px;
    text-align: center;
    font-size: 0.8rem;
    color: #777;
  }

  .control {
    padding: 10px 0 0;
    text-align: center;
    border-top: 1px solid #eee;
  }
}

.el-button {
  padding: 20px 0 10px;
}
</style>
