<template>
  <div>
    <el-row class="toolbar">
      <el-col :span="18">
        <span>所有课程</span>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search"></el-input>
      </el-col>
    </el-row>

    <el-row 
      class="course-bar" 
      :gutter="20" 
      v-for="i in Math.ceil(courses.length / 4)" 
      :key="i"
    >
      <el-col 
        :span="6" 
        v-for="(course, index) in courses.slice((i - 1) * 4, (i - 1) * 4 + 4)" 
        :key="index"
      >
        <CourseCard :course="course" />
      </el-col>
    </el-row>

    
  </div>
</template>

<script>
import CourseCard from './CourseCard';

export default {
  data() {
    return {
      search: '',
      courses: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      this.courses = [
        {
          title: '网络工程设计',
          teacher: '余小华',
          cover: require('../assets/logo.png')
        },
        {
          title: '传感器与检测技术',
          teacher: '朱朝平',
          cover: require('../assets/logo.png')
        },
        {
          title: '计算机网络',
          teacher: '余小华',
          cover: require('../assets/logo.png')
        },
        {
          title: '网络管理原理与技术',
          teacher: '李慧芬',
          cover: require('../assets/logo.png')
        },

        {
          title: '计算机网络',
          teacher: '余小华',
          cover: require('../assets/logo.png')
        },
        {
          title: '网络管理原理与技术',
          teacher: '李慧芬',
          cover: require('../assets/logo.png')
        },
        {
          title: '计算机网络',
          teacher: '余小华',
          cover: require('../assets/logo.png')
        },
      ];
    }
  },
  components: {
    CourseCard
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  margin-bottom: 20px;
}

.course-bar {
  margin-bottom: 30px;
}
</style>
