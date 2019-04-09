<template>
  <div>
    <el-row class="header">
      <el-col>
        <span class="exam-name">{{examName}}</span>
      </el-col>
    </el-row>
    <el-row class="questions">
      <el-card
        v-for="(choiceQuestion, index) in choiceQuestions"
        :key="choiceQuestion.id"
        class="question"
      >
        <el-row class="question-info">
          <span class="question-index">第{{index + 1}}题</span>
          <span
            class="question-type"
          >[{{choiceQuestion.questionType === 'Exclusive' ? '单选题' : '多选题'}}]</span>：
          <span class="problem">{{choiceQuestion.problem}}</span>
        </el-row>
        <el-row class="question-imgs" :gutter="20">
          <el-col
            :span="18"
            v-for="img in choiceQuestion.detail.imgs"
            :key="img.name"
            class="question-img"
          >
            <a :href="img.url" target="_blank">
              <img :src="img.url" :alt="img.name">
            </a>
          </el-col>
        </el-row>
        <el-row v-if="choiceQuestion.questionType === 'Exclusive'" class="question-selections">
          <el-radio-group v-model="userAnswer[choiceQuestion.id]">
            <el-radio
              v-for="selection in choiceQuestion.detail.selections"
              :key="selection.id"
              :label="selection.id"
              class="question-selection"
            >{{selection.content}}</el-radio>
          </el-radio-group>
        </el-row>
        <el-row v-if="choiceQuestion.questionType === 'Multiple'" class="question-selections">
          <el-checkbox-group v-model="userAnswer[choiceQuestion.id]">
            <el-checkbox
              v-for="selection in choiceQuestion.detail.selections"
              :key="selection.id"
              :label="selection.id"
              @change="checkbox(choiceQuestion.id, selection.id)"
              class="question-selection"
            >{{selection.content}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
      </el-card>
    </el-row>
    <el-row type="flex" justify="center" class="control">
      <el-col :span="6" class="countdown">
        <span>倒计时：{{countdown}}</span>
      </el-col>
      <el-col :span="6" class="submit">
        <el-button type="primary" @click="handIn">交 卷</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseID: '',
      examID: '',
      examName: '',
      choiceQuestions: [],
      userAnswer: {},
      examTiming: 60,
      countdown: '',
      haveBeenHandIn: false
    };
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.examID = this.$route.query.id;
    if (!this.examID) {
      this.$alert('没有找到该考试！', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
        .then(() => {
          this.$router.push({ path: `/exam/${this.courseID}` });
        })
        .catch(() => {});
    } else {
      this.getExamPaper();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.haveBeenHandIn && this.countdown !== '00:00:00') {
      this.$confirm('考试途中不能退出, 是否交卷?', '提示', {
        confirmButtonText: '交卷',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handInExamPaper();
        })
        .catch(() => {});
    }
    if (this.haveBeenHandIn) {
      next();
    }
  },
  methods: {
    initCountdown() {
      const hour = Math.floor(this.examTiming / 60);
      const mins = this.examTiming % 60;
      this.countdown = `${hour < 10 ? '0' + hour : hour}:${
        mins < 10 ? '0' + mins : mins
      }:00`;
    },
    autoEnding() {
      this.$alert('考试已结束，将自动交卷', '考试结束', {
        confirmButtonText: '确定',
        showClose: false
      }).then(() => {
        this.handInExamPaper();
      });
    },
    countdownTime() {
      let timer = setInterval(() => {
        const time = this.countdown.split(':').map(x => parseInt(x));
        let h = time[0];
        let m = time[1];
        let s = time[2];
        if (s === 0) {
          s = 59;
          if (m === 0) {
            if (h === 0) {
              s = 0;
              clearInterval(timer);
              this.autoEnding();
            }
            if (h > 0) {
              m = 59;
              h--;
            }
          } else {
            m--;
          }
        } else {
          s--;
        }
        this.countdown = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${
          s < 10 ? '0' + s : s
        }`;

        if (s === 0 && h === 0 && m === 15) {
          this.$message('离考试结束还有15分钟，请抓紧时间答题');
        }
      }, 1000);
    },
    getExamPaper() {
      this.$http
        .post('/api/getExamPaper', {
          courseID: this.courseID,
          examID: this.examID
        })
        .then(res => {
          if (res.data.code === 1) {
            this.examName = res.data.data.examName;
            this.choiceQuestions = res.data.data.choiceQuestions;
            this.examTiming = res.data.data.examTiming;
            this.initCountdown();
            this.countdownTime();
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
              confirmButtonText: '确定'
            }).then(() => {
              this.$router.push({ path: `/exam/${this.courseID}` });
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
            confirmButtonText: '确定'
          }).then(() => {
            this.$router.push({ path: `/exam/${this.courseID}` });
          });
        });
    },
    checkbox(id, label) {
      if (Array.isArray(this.userAnswer[id])) {
        this.userAnswer[id] = this.userAnswer[id].sort();
      } else {
        this.$set(this.userAnswer, id, [label]);
      }
    },
    handInExamPaper() {
      this.$http
        .post('/api/handIn', {
          courseID: this.courseID,
          examID: this.examID,
          userAnswer: this.userAnswer
        })
        .then(res => {
          if (res.data.code === 1) {
            this.haveBeenHandIn = true;
            this.$alert(`您的成绩为${res.data.data.score}`, '您的成绩', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.replace({ path: `/exam/${this.courseID}` });
              }
            });
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$alert('发生了错误导致提交失败', '提交失败', {
              confirmButtonText: '确定'
            }).then(() => {});
          }
        })
        .catch(err => {
          console.log(err);
          this.$alert('发生了错误导致提交失败', '提交失败', {
            confirmButtonText: '确定'
          }).then(() => {});
        });
    },
    handIn() {
      this.$confirm('交卷后无法再次进入考试修改答案, 是否交卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handInExamPaper();
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;

  .exam-name {
    font-size: 1.2rem;
  }
}
.questions {
  margin-bottom: 100px;

  .question {
    margin-bottom: 20px;

    .question-info {
      margin-bottom: 20px;

      .problem {
        font-weight: bold;
      }

      .question-index {
      }
      .question-type {
        color: #888;
      }
    }

    .question-imgs {
      margin-bottom: 20px;

      .question-img {
        margin-bottom: 10px;

        img {
          width: 100%;
        }
      }
    }

    .question-selections {
      margin-bottom: 20px;

      .question-selection {
        display: block;
        margin-bottom: 1rem;
      }
    }
  }
}

.control {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100vw;
  height: 80px;
  background-color: #d4edda;

  .countdown {
    text-align: center;
    line-height: 80px;
    font-size: 1.5rem;
  }

  .submit {
    text-align: center;
    line-height: 80px;
  }
}
</style>
