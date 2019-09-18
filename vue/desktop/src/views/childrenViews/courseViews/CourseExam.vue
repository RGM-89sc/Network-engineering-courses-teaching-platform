<template>
  <div>
    <el-row class="header">
      <el-col :span="12">
        <span class="course-name">{{ courseName }}</span>
      </el-col>
      <el-col class="toolsbar" v-if="user && user.userType === 1">
        <el-button
          type="primary"
          @click="$router.push({ path: `${$route.path}/addExamPaper` })"
          >发布考试</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="examPapers.length === 0" class="no-exam-paper">
      <span>暂无考试</span>
    </el-row>
    <el-row>
      <el-card
        v-for="examPaper in examPapers"
        :key="examPaper.examID"
        class="exam-paper"
      >
        <el-row>
          <el-col :span="18">
            <span class="exam-name" @click="enterExam(examPaper)">{{
              examPaper.examName
            }}</span>
          </el-col>
          <el-col
            :span="6"
            style="text-align: right;"
            v-if="user && user.userType === 1"
          >
            <el-button type="text" @click="openSetExamDialog(examPaper)"
              >设置</el-button
            >
            <el-button type="text" @click="delExamPaper(examPaper.examID)"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span class="start-end-time"
              >考试有效期：{{
                $dayjs(examPaper.startTime).format('YYYY/MM/DD HH:mm:ss')
              }}
              -
              {{
                $dayjs(examPaper.endTime).format('YYYY/MM/DD HH:mm:ss')
              }}</span
            >
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-dialog
      title="设置考试"
      :visible.sync="settingExam"
      width="40%"
      v-if="user && user.userType === 1"
    >
      <el-form label-width="100px" label-position="top">
        <el-form-item label="考试时长：">
          <el-input-number
            :min="30"
            v-model="currentSettingExam.examTiming"
            :step="5"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="考试有效期：">
          <el-date-picker
            v-model="currentSettingExam.startEndTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="settingExam = false">取 消</el-button>
        <el-button type="primary" @click="updateExamPaper">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseID: '',
      courseName: '',
      examPapers: [],
      settingExam: false,
      currentSettingExam: {
        examTiming: 60,
        startEndTime: []
      }
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.courseName = window.sessionStorage.getItem('exams.current_coursename');
    this.getExamPapers();
  },
  methods: {
    getExamPapers() {
      this.$http
        .post('/api/getExamPapers', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.examPapers = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    enterExam(examPaper) {
      const now = new Date();
      if (
        now < new Date(examPaper.startTime) ||
        now > new Date(examPaper.endTime) - examPaper.examTiming * 60 * 1000
      ) {
        this.$alert('不在该考试有效期内！', '无法进入考试', {
          confirmButtonText: '确定'
        });
        return null;
      }
      if (this.user && (this.user.userType === 1 || this.user.userType === 0)) {
        this.$http
          .post('/api/checkStuCanEnterExam', {
            courseID: this.courseID,
            examID: examPaper.examID
          })
          .then(res => {
            if (res.data.code === 1) {
              if (!res.data.data.canEnterExam) {
                this.$alert(res.data.data.reason, '无法进入考试', {
                  confirmButtonText: '确定'
                });
                return null;
              } else {
                this.$router.push({
                  path: `/exam/${this.courseID}/examPaper?id=${examPaper.examID}`
                });
              }
            }
            if (res.data.code === -1) {
              console.log(res.data.errMsg);
              this.$alert('发生了错误导致进入考试失败', '进入考试失败', {
                confirmButtonText: '确定'
              }).then(() => {});
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$router.push({ path: '/auth' });
      }
    },
    openSetExamDialog(examPaper) {
      this.$set(this.currentSettingExam, 'examTiming', examPaper.examTiming);
      this.$set(this.currentSettingExam, 'startEndTime', [
        examPaper.startTime,
        examPaper.endTime
      ]);
      this.$set(this.currentSettingExam, 'examID', examPaper.examID);
      this.settingExam = true;
    },
    updateExamPaper() {
      if (
        (this.currentSettingExam.startEndTime[1] -
          this.currentSettingExam.startEndTime[0]) /
          1000 /
          60 <
        this.currentSettingExam.examTiming
      ) {
        this.$message({
          message: '考试有效期不能少于考试时长！',
          type: 'error'
        });
      } else {
        this.$http
          .post('/api/updateExamPaper', {
            courseID: this.courseID,
            examID: this.currentSettingExam.examID,
            startTime: this.currentSettingExam.startEndTime[0],
            endTime: this.currentSettingExam.startEndTime[1],
            examTiming: this.currentSettingExam.examTiming
          })
          .then(res => {
            if (res.data.code === 1) {
              this.$router.push({ path: '/emptyPage' });
            }
            if (res.data.code === -1) {
              this.$alert('发生了错误导致操作失败', '操作失败', {
                confirmButtonText: '确定'
              });
              console.log(res.data.errMsg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    delExamPaper(examID) {
      this.$confirm('此操作将删除该考试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/delExamPaper', {
              courseID: this.courseID,
              examID
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({ path: '/emptyPage' });
              }
              if (res.data.code === -1) {
                this.$alert('发生了错误导致删除失败', '删除失败', {
                  confirmButtonText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
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

  .course-name {
    font-size: 1.2rem;
    line-height: 40px;
  }

  .toolsbar {
    text-align: right;
  }
}

.no-exam-paper {
  padding: 5rem;
  text-align: center;
  color: #909090;
}

.exam-paper {
  margin-bottom: 20px;

  .exam-name {
    line-height: 40px;
    cursor: pointer;
  }
  .start-end-time {
    display: block;
    padding-bottom: 10px;
    font-size: 0.8rem;
    color: #777;
  }
}
</style>
