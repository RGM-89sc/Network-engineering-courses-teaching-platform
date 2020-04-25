<template>
  <div>
    <div class="header">
      <span>统计信息 - {{courseName}}</span>
    </div>

    <div class="no-stu" v-if="stus.length === 0">
      <span>暂无数据</span>
    </div>

    <Card class="course-detail" v-for="(stu, index) in stus" :key="index" round>
      <div class="exam">
        <md-detail-item title="学号" :content="stu.id"/>
        <md-detail-item title="姓名" :content="stu.username"/>
        <div class="exams">
          <span class="title">考试成绩</span>
          <div class="exam" v-for="exam in stu.exams" :key="exam.examID">
            <md-detail-item title="试卷" :content="exam.examName"/>
            <md-detail-item title="成绩" :content="exam.examScore"/>
            <md-detail-item title="操作">
              <span style="color: #409EFF" @click="resetStuExam(stu.id, exam)">重置成绩</span>
            </md-detail-item>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from './Card';

export default {
  data() {
    return {
      courseID: '',
      loadingStusData: true,
      courseName: '',
      courseExams: [],
      stus: []
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
        .post('getCourseStusAndExams', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.courseExams = res.data.data.exams;
            this.courseName = res.data.data.course.coursename;
            const stus = res.data.data.course.stus;
            stus.forEach(stu => {
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

              this.stus.forEach((stu, index) => {
                let currentStuExams = [];
                this.courseExams.forEach(exam => {
                  let score = '-';
                  stu.exams.some(e => {
                    if (e.examID === exam.examID) {
                      score = e.examScore;
                      return true;
                    }
                    return false;
                  });
                  currentStuExams.push({
                    examID: exam.examID,
                    examName: exam.examName,
                    examScore: score
                  });
                });
                this.stus[index].exams = currentStuExams;
              });
            });
            this.loadingStusData = false;
          }
          if (res.data.code === -1) {
            this.$toast.failed('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.failed('加载失败');
        });
    },
    resetStuExam(stuID, exam) {
      this.$dialog.confirm({
        title: '提示',
        content:
          '将把该生的该考试成绩重置并不可撤销，学生需重新考试, 是否继续?',
        confirmText: '确定',
        onConfirm: () => {
          let isScoreNull = false;

          if (exam.examScore === '-') {
            isScoreNull = true;
          }

          if (isScoreNull) {
            this.$toast.info('该生未参与该考试，无需重置');
            return null;
          }
          this.$http
            .post('resetStuExamScore', {
              stuID,
              courseID: this.courseID,
              examID: exam.examID
            })
            .then(res => {
              if (res.data.code === 1) {
                let stuIndex, examIndex;
                this.stus.some((stu, index) => {
                  if (stu.id === stuID) {
                    stuIndex = index;
                    return true;
                  }
                  return false;
                });
                this.stus[stuIndex].exams.some((e, index) => {
                  if (e.examID === exam.examID) {
                    examIndex = index;
                    return true;
                  }
                  return false;
                });
                this.stus[stuIndex].exams[examIndex].examScore = '-';
                this.$toast.succeed('重置成功');
              }
              if (res.data.code === -1) {
                console.log(res.data.errMsg);
                this.$toast.failed('发生错误，操作失败');
              }
            })
            .catch(err => {
              console.log(err);
              this.$toast.failed('发生错误，操作失败');
            });
        }
      });
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin: 1.5rem 1rem;
}

.no-stu {
  padding: 3rem;
  text-align: center;
  color: #606266;
}

.exams {
  padding-top: 1rem;
  border-top: 1px solid #eee;

  .title {
    display: block;
    margin-bottom: 0.5rem;
    color: #606266;
  }

  .exam {
    border-bottom: 1px solid #eee;
  }
}
</style>
