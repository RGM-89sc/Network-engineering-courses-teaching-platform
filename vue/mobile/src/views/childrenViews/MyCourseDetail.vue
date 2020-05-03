<template>
  <div>
    <TchCourseDetail 
      v-if="user && user.userType === 1" 
      @changeCourseComponent="changeCourseComponentHandler" 
      :user="user" 
      :courseID="courseID"></TchCourseDetail>
    <StuCourseDetail 
      v-if="user && user.userType === 0" 
      :user="user" 
      @changeCourseComponent="changeCourseComponentHandler"
      :courseID="courseID"></StuCourseDetail>
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
    },
    courseID: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeCourseComponentHandler(route) {
      this.$emit('changeCourseComponent', route);
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
