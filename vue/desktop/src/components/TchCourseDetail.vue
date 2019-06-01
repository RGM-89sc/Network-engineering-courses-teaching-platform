<template>
  <div>
    <el-row class="header">
      <span>
        <i class="el-icon-arrow-left icon" title="返回" @click="$router.go(-1)"></i>
        统计信息 - {{courseName}}
      </span>
    </el-row>
    <el-row>
      <el-table :data="stus" border style="width: 100%" v-loading="loadingStusData">
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column prop="id" label="学号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column label="考试成绩">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkStuExamResult(scope.row)">查看该生所有考试成绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog :title="currentStuID + ' - ' + currentStuName" :visible.sync="checkingStuExamReslt">
      <el-table :data="currentStuExams">
        <el-table-column property="examName" label="试卷" width="150"></el-table-column>
        <el-table-column property="examScore" label="成绩" width="200"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="resetStuExam(scope.row.examID)">重置成绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseID: '',
      loadingStusData: true,
      courseName: '',
      courseExams: [],
      stus: [],
      checkingStuExamReslt: false,
      currentStuID: '',
      currentStuName: '',
      currentStuExams: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.courseID = this.$route.query.id;
    this.getCourseStusAndExams();
  },
  methods: {
    getCourseStusAndExams() {
      this.$http
        .post('/api/getCourseStusAndExams', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.courseExams = res.data.data.exams;
            this.courseName = res.data.data.course.coursename;
            res.data.data.course.stus.forEach(stu => {
              let progress, exams;
              stu.study.some(course => {
                if (course.courseID === this.courseID) {
                  progress = course.progress;
                  exams = course.exams;
                  return true;
                }
                return false;
              });
              this.stus.push({
                id: stu.id,
                username: stu.username,
                progress,
                exams
              });
            });
            this.loadingStusData = false;
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
    checkStuExamResult(stu) {
      this.currentStuID = stu.id;
      this.currentStuName = stu.username;
      this.currentStuExams = [];
      this.courseExams.forEach(exam => {
        let score = '-';
        stu.exams.some(e => {
          if (e.examID === exam.examID) {
            score = e.examScore;
            return true;
          }
          return false;
        });
        this.currentStuExams.push({
          examID: exam.examID,
          examName: exam.examName,
          examScore: score
        });
      });
      this.checkingStuExamReslt = true;
    },
    resetStuExam(examID) {
      this.$confirm(
        '将把该生的该考试成绩重置并不可撤销，学生需重新考试, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let isScoreNull = false;
          this.currentStuExams.some(e => {
            if (e.examID === examID) {
              if (e.examScore === '-') {
                isScoreNull = true;
              }
              return true;
            }
            return false;
          });
          if (isScoreNull) {
            this.$message('该生未参与该考试，无需重置');
            return null;
          }
          this.$http
            .post('/api/resetStuExamScore', {
              stuID: this.currentStuID,
              courseID: this.courseID,
              examID
            })
            .then(res => {
              if (res.data.code === 1) {
                this.currentStuExams.some((e, index) => {
                  if (e.examID === examID) {
                    this.currentStuExams[index].examScore = '-';
                    return true;
                  }
                  return false;
                });
                let stuIndex, examIndex;
                this.stus.some((stu, index) => {
                  if (stu.id === this.currentStuID) {
                    stuIndex = index;
                    return true;
                  }
                  return false;
                });
                this.stus[stuIndex].exams.some((e, index) => {
                  if (e.examID === examID) {
                    examIndex = index;
                    return true;
                  }
                  return false;
                });
                this.stus[stuIndex].exams[examIndex].examScore = '-';
                this.$message({
                  message: '重置成功',
                  type: 'success'
                });
              }
              if (res.data.code === -1) {
                console.log(res.data.errMsg);
                this.$message.error('发生错误，操作失败');
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error('发生错误，操作失败');
            });
        })
        .catch(err => {});
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
