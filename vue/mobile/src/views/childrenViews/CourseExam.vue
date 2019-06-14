<template>
  <div class="gray-bg">
    <Card round>
      <div class="header">
        <span class="title">{{courseName}}</span>
        <div class="tool-bar" v-if="user && user.userType === 1">
          <!-- <md-button
            class="add-exercise-paper"
            type="link"
            @click="$router.push({ path: `/exam/${courseID}/addExamPaper` })"
          >发布考试</md-button> -->
        </div>
      </div>

      <div class="no-exam-paper" v-if="examPapers.length === 0">
        <span>暂无考试</span>
      </div>

      <md-cell-item
        v-for="examPaper in examPapers"
        :key="examPaper.examID"
        :title="examPaper.examName"
        arrow
        :brief="`考试有效期：${$dayjs(examPaper.startTime).format('YYYY/MM/DD HH:mm:ss')} - ${$dayjs(examPaper.endTime).format('YYYY/MM/DD HH:mm:ss')}`"
        @click="enterExam(examPaper)"
      />
    </Card>

    <!-- <el-col :span="6" style="text-align: right;" v-if="user && user.userType === 1">
            <el-button type="text" @click="openSetExamDialog(examPaper)">设置</el-button>
            <el-button type="text" @click="delExamPaper(examPaper.examID)">删除</el-button>
    </el-col>-->

    <!-- <el-dialog
      title="设置考试"
      :visible.sync="settingExam"
      width="40%"
      v-if="user && user.userType === 1"
    >
      <el-form label-width="100px" label-position="top">
        <el-form-item label="考试时长：">
          <el-input-number :min="30" v-model="currentSettingExam.examTiming" :step="5"></el-input-number>
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
    </el-dialog>-->
  </div>
</template>

<script>
import Card from '../../components/Card';

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
        this.$dialog.failed({
          title: '无法进入考试',
          content: '不在该考试有效期内！',
          confirmText: '确定',
          onConfirm: () => {}
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
                this.$dialog.failed({
                  title: '无法进入考试',
                  content: res.data.data.reason,
                  confirmText: '确定',
                  onConfirm: () => {}
                });
                return null;
              } else {
                this.$router.push({
                  path: `/exam/${this.courseID}/examPaper?id=${
                    examPaper.examID
                  }`
                });
              }
            }
            if (res.data.code === -1) {
              console.log(res.data.errMsg);
              this.$dialog.failed({
                title: '进入考试失败',
                content: '发生了错误导致进入考试失败',
                confirmText: '确定',
                onConfirm: () => {}
              });
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
              this.$dialog.failed({
                title: '操作失败',
                content: '发生了错误导致操作失败',
                confirmText: '确定',
                onConfirm: () => {}
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
                this.$dialog.failed({
                  title: '删除失败',
                  content: '发生了错误导致删除失败',
                  confirmText: '确定',
                  onConfirm: () => {}
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
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: table;
  width: 100%;

  .title {
    display: table-cell;
  }

  .tool-bar {
    display: table-cell;
    text-align: right;
  }
}

.no-exam-paper {
  margin: 5rem 0;
  text-align: center;
  color: #606266;
}
</style>
