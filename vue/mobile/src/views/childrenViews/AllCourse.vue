<template>
  <div class="all-course" :class="{ 'gray-bg': courses.length > 0 }">
    <!-- <div class="add-new-course-panel" v-if="user && user.userType === 1 && addCourseDialogVis">
      课程名称、课程封面
    </div>-->

    <div class="search-panel" v-show="searchPanelShow">
      <div class="search-input">
        <md-icon class="search" name="search"></md-icon>
        <input
          type="text"
          autofocus
          placeholder="搜索课程名称或教师名称"
          @change="event => {this.searchValue = event.target.value}"
          @keyup.enter="searchCourse"
        >
        <md-button class="btn-cancel" type="link" @click="searchPanelShow = false">取消</md-button>
      </div>
      <!-- <md-button
        type="primary"
        class="btn-search"
        icon="search"
        @click="!(searchPanelShow = false) && (search = searchValue)"
      >搜索</md-button> -->
    </div>

    <div class="toolbar">
      <div class="search" @click="(searchPanelShow = true) && (searchValue = search = '')">
        <md-icon class="search-icon" name="search" svg></md-icon>
      </div>
      <!-- <div class="add" v-if="user && user.userType === 1" @click="addCourseDialogVis = true">
        <md-icon class="add-icon" name="edit" svg></md-icon>
      </div>-->
    </div>

    <Card round :style="{ paddingBottom: '10px' }" v-for="course in courses" :key="course.courseid">
      <CourseCard :course="course"/>
    </Card>

    <md-result-page v-show="courses.length === 0"></md-result-page>
  </div>
</template>

<script>
import '../../assets/svg/edit.svg';
import '../../assets/svg/search.svg';
import Card from '../../components/Card';
import CourseCard from '../../components/CourseCard';

export default {
  data() {
    return {
      searchValue: '',
      search: '',
      allCourses: [],
      // addCourseDialogVis: false,
      // formRules: {
      //   newCourseName: [
      //     { required: true, message: '请填写课程名称', trigger: 'blur' }
      //   ],
      //   newCourseCover: [
      //     {
      //       required: true,
      //       message: '请为该课程选择一个封面',
      //       trigger: 'change'
      //     }
      //   ]
      // },
      // newCourse: {
      //   newCourseName: '',
      //   newCourseCover: []
      // },
      // newCourseCoverMaxSize: 500,
      // addingNewCourse: false,

      searchPanelShow: false
    };
  },
  computed: {
    courses() {
      return this.allCourses.filter(course => {
        const reg = new RegExp(this.search, 'i');
        return reg.test(course.coursename) || reg.test(course.tch[0].username);
      });
    }
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
    searchCourse () {
      this.search = this.searchValue
      this.searchPanelShow = false
    },
    getCourses() {
      this.$http
        .get('/api/getCourses')
        .then(res => {
          if (res.data.code === 1) {
            this.allCourses = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    }
    // addNewCourseSuccess(response, file, fileList) {
    //   if (response.code === 1) {
    //     this.addingNewCourse = false;
    //     this.addCourseDialogVis = false;
    //     this.$router.push({ path: '/emptyPage' });
    //   }
    //   if (response.code === 0) {
    //     this.addingNewCourse = false;
    //     this.$alert(response.info, '添加课程失败', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //         this.$router.push({ path: '/emptyPage' });
    //       }
    //     });
    //   }
    //   if (response.code === -1) {
    //     this.addingNewCourse = false;
    //     this.$alert('发生了错误导致上传失败', '上传失败', {
    //       confirmButtonText: '确定'
    //     });
    //     console.log(response.errMsg);
    //   }
    // },
    // beforeAddNewCourse(file) {
    //   if (file.size / 1024 > this.newCourseCoverMaxSize) {
    //     // 大于对封面大小的限制
    //     this.$confirm(
    //       `课程封面图片大小不能超过${
    //         this.newCourseCoverMaxSize
    //       }KB，请重新选择课程封面`,
    //       '提示',
    //       {
    //         confirmButtonText: '确定',
    //         type: 'error',
    //         showCancelButton: false
    //       }
    //     );
    //     return false;
    //   }
    //   return true;
    // },
    // addNewCourse() {
    //   this.addingNewCourse = true;
    //   this.$refs.upload.submit();
    // },
  },
  components: {
    CourseCard,
    Card
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: table;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.4rem;
  background: white;
  border: 1px solid #ededed;
  z-index: 900;

  .search,
  .add {
    display: table-cell;

    .search-icon,
    .add-icon {
      display: block;
      box-sizing: border-box;
      margin: 0 auto;
      height: 2.4rem;
    }
  }
}

.search-panel,
.add-new-course-panel {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  padding: 1rem;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 9999;
}

.search-panel {
  .search-input {
    position: relative;
    margin-bottom: 2rem;

    .search {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      width: 1.8rem;
      height: 1.8rem;
    }

    input {
      box-sizing: border-box;
      padding: 0.5rem 0.5rem 0.5rem 2.55rem;
      width: calc(100% - 3rem);
      height: 2.5rem;
      font-size: 0.9rem;
      outline: none;
      border: none;
      border-radius: 10px;
      background-color: #ededed;
    }

    .btn-cancel {
      width: 3rem;
      height: 2.5rem;
      font-size: 1rem;
    }
  }

  .btn-search {
    margin: 0 auto;
    width: 75%;
    height: 2.4rem;
  }
}

.add-new-course-panel {
}

.no-course {
  padding: 10vh 2rem 0;
  text-align: center;
  color: #909090;
}

.course-bar {
  margin-bottom: 30px;
}
</style>
