<template>
  <div>
    <el-row class="header">
      <span>
        <i
          class="el-icon-arrow-left icon"
          title="返回"
          @click="
            $emit('changeCourseComponent', {
              from: 'myCourseDetail',
              to: 'myCourses'
            })
          "
        ></i>
        统计信息 - {{ courseName }}
      </span>
    </el-row>
    <el-row>
      <el-table
        :data="courseExams"
        border
        style="width: 100%"
        v-loading="loadingData"
      >
        <el-table-column prop="examName" label="试卷"></el-table-column>
        <el-table-column prop="examScore" label="成绩"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { UserProvider } from '../provider/index'

export default {
  data() {
    return {
      loadingData: true,
      courseName: '',
      courseExams: []
    };
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
  created() {
    this.getMyCourseExams();
  },
  methods: {
    getMyCourseExams() {
      UserProvider.student.getMyCourseExams({ courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.courseName = res.data.course.coursename;
            res.data.exams.forEach(exam => {
              let score = '-';
              res.data.stu.exams.some(e => {
                if (e.examID === exam.examID) {
                  score = e.examScore;
                  return true;
                }
                return false;
              });
              this.courseExams.push({
                examName: exam.examName,
                examScore: score
              });
            });
            this.loadingData = false;
          }
          if (res.data.code === -1) {
            console.log(res.errMsg);
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
.header {
  margin-bottom: 20px;

  .icon {
    margin-right: 10px;
    padding: 5px;
    font-weight: bold;
    color: #409eff;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background-color: rgb(250, 250, 250);
    }
  }
}
</style>
