<template>
  <div class="gray-bg">
    <div class="header">
      <span class="exam-name">{{examName}}</span>
    </div>

    <div class="questions">
      <Card
        round
        v-for="(choiceQuestion, index) in choiceQuestions"
        :key="choiceQuestion.id"
        class="question"
      >
        <div class="question-info">
          <span class="question-index">第{{index + 1}}题</span>
          <span
            class="question-type"
          >[{{choiceQuestion.questionType === 'Exclusive' ? '单选题' : '多选题'}}]</span>：
          <span class="problem">{{choiceQuestion.problem}}</span>
        </div>

        <div class="question-imgs">
          <div class="question-img" v-for="img in choiceQuestion.detail.imgs" :key="img.name">
            <a :href="img.url" target="_blank">
              <img :src="img.url" :alt="img.name">
            </a>
          </div>
        </div>

        <div v-if="choiceQuestion.questionType === 'Exclusive'" class="question-selections">
          <md-radio
            v-for="selection in choiceQuestion.detail.selections"
            :key="selection.id"
            :name="selection.id"
            v-model="userAnswer[choiceQuestion.id]"
            :label="selection.content"
          />
        </div>
        <div v-if="choiceQuestion.questionType === 'Multiple'" class="question-selections">
          <md-check-group v-model="userAnswer[choiceQuestion.id]">
            <md-check
              v-for="selection in choiceQuestion.detail.selections"
              :key="selection.id"
              :name="selection.id"
              :label="selection.content"
            />
          </md-check-group>
        </div>
      </Card>
    </div>

    <div class="submit">
      <md-button type="primary" @click="handIn">交 卷</md-button>
    </div>

    <div class="countdown">
      <span>倒计时：{{countdown}}</span>
    </div>
  </div>
</template>

<script>
import Card from '../../components/Card';

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
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.examID = this.$route.query.id;
    if (!this.examID) {
      this.$dialog.failed({
        title: '错误',
        content: '没有找到该考试！',
        confirmText: '确定',
        onConfirm: () => {
          this.$router.push({ path: `/exam/${this.courseID}` });
        }
      });
    } else {
      this.getExamPaper();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.haveBeenHandIn && this.countdown !== '00:00:00') {
      this.$dialog.confirm({
        title: '提示',
        content: '考试途中不能退出, 是否交卷?',
        confirmText: '确定',
        onConfirm: () => {
          this.handInExamPaper();
        }
      });
    }
    if (this.haveBeenHandIn) {
      next();
    }
  },
  methods: {
    initUserAnswer() {
      const userAnswer = JSON.parse(
        window.sessionStorage.getItem(
          `exam.${this.courseID}.${this.examID}.${this.user.id}.userAnswer`
        )
      );
      if (userAnswer && JSON.stringify(userAnswer) !== '{}') {
        Object.entries(userAnswer).forEach(([key, value]) => {
          this.$set(this.userAnswer, key, value);
        });
      }
    },
    initCountdown() {
      const countdown = window.sessionStorage.getItem(
        `exam.${this.courseID}.${this.examID}.${this.user.id}.countdown`
      );
      if (countdown) {
        this.countdown = countdown;
      } else {
        const hour = Math.floor(this.examTiming / 60);
        const mins = this.examTiming % 60;
        this.countdown = `${hour < 10 ? '0' + hour : hour}:${
          mins < 10 ? '0' + mins : mins
        }:00`;
      }
    },
    autoEnding() {
      this.$dialog.alert({
        title: '考试结束',
        content: '考试已结束，将自动交卷',
        confirmText: '确定',
        onConfirm: () => {
          this.handInExamPaper();
        }
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
          this.$toast.info('离考试结束还有15分钟，请抓紧时间答题');
        }

        if (s % 10 === 0) {
          // 10秒缓存一次考试剩余时间
          window.sessionStorage.setItem(
            `exam.${this.courseID}.${this.examID}.${this.user.id}.countdown`,
            this.countdown
          );
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
            this.initUserAnswer();
            this.countdownTime();
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$dialog.failed({
              title: '获取数据失败',
              content: '发生了错误导致获取数据失败',
              confirmText: '确定',
              onConfirm: () => {
                this.$router.push({ path: `/exam/${this.courseID}` });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$dialog.failed({
            title: '获取数据失败',
            content: '发生了错误导致获取数据失败',
            confirmText: '确定',
            onConfirm: () => {
              this.$router.push({ path: `/exam/${this.courseID}` });
            }
          });
        });
    },
    saveUserAnswerToSS() {
      window.sessionStorage.setItem(
        `exam.${this.courseID}.${this.examID}.${this.user.id}.userAnswer`,
        JSON.stringify(this.userAnswer)
      );
    },
    radio(label) {
      this.saveUserAnswerToSS();
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
            window.sessionStorage.removeItem(
              `exam.${this.courseID}.${this.examID}.${this.user.id}.userAnswer`
            );
            window.sessionStorage.removeItem(
              `exam.${this.courseID}.${this.examID}.${this.user.id}.countdown`
            );

            this.$dialog.alert({
              title: '您的成绩',
              content: `您的成绩为${res.data.data.score}`,
              confirmText: '确定',
              onConfirm: () => {
                this.$router.replace({ path: `/exam/${this.courseID}` });
              }
            });
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$dialog.failed({
              title: '提交失败',
              content: '发生了错误导致提交失败',
              confirmText: '确定',
              onConfirm: () => {}
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$dialog.failed({
            title: '提交失败',
            content: '发生了错误导致提交失败',
            confirmText: '确定',
            onConfirm: () => {}
          });
        });
    },
    handIn() {
      this.$dialog.confirm({
        title: '提示',
        content: '交卷后无法再次进入考试修改答案, 是否交卷?',
        confirmText: '确定',
        onConfirm: () => {
          this.handInExamPaper();
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
  padding: 0 1rem;
  text-align: center;

  .exam-name {
    line-height: 4.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #606266;
  }
}

.questions {
  margin-bottom: 50px;

  .question {
    margin-bottom: 20px;

    .question-info {
      margin-bottom: 20px;

      .problem {
        font-weight: bold;
      }

      .result-mark {
        padding-right: 10px;
        font-size: 1.5rem;
      }

      .question-index {
      }
      .question-type {
        color: #888;
      }
    }

    .question-imgs {
      margin-bottom: 20px;
      width: 80%;

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

    .question-analyze {
      margin: 0 10px;
      padding: 20px;
      background-color: #d4edda;
      border-radius: 5px;
    }
  }
}

.submit {
  margin-bottom: 100px;
  padding: 0 1rem;
}

.countdown {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100vw;
  height: 80px;
  background-color: #d4edda;
  text-align: center;
  line-height: 80px;
  font-size: 1.5rem;
}
</style>
