<template>
  <div>
    <TchCourseDetail :user="user" v-if="user && user.userType === 1"></TchCourseDetail>
    <StuCourseDetail :user="user" v-if="user && user.userType === 0"></StuCourseDetail>
  </div>
</template>

<script>
import TchCourseDetail from '../../components/TchCourseDetail';
import StuCourseDetail from '../../components/StuCourseDetail';

export default {
  data() {
    return {

    }
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  components: {
    TchCourseDetail,
    StuCourseDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
