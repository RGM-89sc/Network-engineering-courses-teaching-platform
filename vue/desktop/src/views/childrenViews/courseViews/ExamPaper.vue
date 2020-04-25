<template>
  <div>
    <el-row class="header">
      <el-col>
        <span class="exam-name">{{ examName }}</span>
      </el-col>
    </el-row>
    <el-row class="questions">
      <el-card
        v-for="(choiceQuestion, index) in choiceQuestions"
        :key="choiceQuestion.id"
        class="question"
      >
        <el-row class="question-info">
          <span class="question-index">第{{ index + 1 }}题</span>
          <span class="question-type"
            >[{{
              choiceQuestion.questionType === 'Exclusive' ? '单选题' : '多选题'
            }}]</span
          >：
          <span class="problem">{{ choiceQuestion.problem }}</span>
        </el-row>
        <el-row class="question-imgs" :gutter="20">
          <el-col
            :span="18"
            v-for="img in choiceQuestion.detail.imgs"
            :key="img.name"
            class="question-img"
          >
            <a :href="img.url" target="_blank">
              <img :src="img.url" :alt="img.name" />
            </a>
          </el-col>
        </el-row>
        <el-row
          v-if="choiceQuestion.questionType === 'Exclusive'"
          class="question-selections"
        >
          <el-radio-group v-model="userAnswer[choiceQuestion.id]">
            <el-radio
              v-for="selection in choiceQuestion.detail.selections"
              :key="selection.id"
              :label="selection.id"
              @change="radio"
              class="question-selection"
              >{{ selection.content }}</el-radio
            >
          </el-radio-group>
        </el-row>
        <el-row
          v-if="choiceQuestion.questionType === 'Multiple'"
          class="question-selections"
        >
          <el-checkbox
            v-for="selection in choiceQuestion.detail.selections"
            :key="selection.id"
            :label="selection.id"
            @change="checkbox(choiceQuestion.id, selection.id)"
            class="question-selection"
          >{{ selection.content }}</el-checkbox>
        </el-row>
      </el-card>
    </el-row>
    <el-row type="flex" justify="center" class="control">
      <el-col :span="6" class="countdown">
        <span>倒计时：{{ countdown }}</span>
      </el-col>
      <el-col :span="6" class="submit">
        <el-button type="primary" @click="handIn">交 卷</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ExamsProvider } from '@/provider/index';
import io from 'socket.io-client';
import config from '@/config/index';
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
      haveBeenHandIn: false,
      examStatus: false,
      serverEnded: false,
      socket: {
        instance: null,
        closed: true
      },
      countdownTimer: null,
      currentExamID: '',
      curTimeStamp: Date.now(),
      timeDiff: 0
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
    this.timeDiff = this.curTimeStamp - (+this.$route.query.time);
    this.timeDiff = this.timeDiff > 100 ? this.timeDiff : 0;
    if (!this.examID) {
      this.$alert('没有找到该考试！', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
        .then(() => {
          this.$router.push({path: `/course/${this.courseID}/exam`});
        })
        .catch(() => {});
    } else {
      this.getExamPaper();
    }
    //加上时间戳，解决重新考试计时器显示不正确问题，可能是由于timer未清除，一直在setItem的原因，timer未清除的原因未知
    this.currentExamID =  `exam.${this.courseID}.${this.examID}.${this.user.id}.${this.$route.query.time}.`; 
    this.$notify({
      title: '警告',
      message: `考试途中不能关闭该页面或关闭浏览器！`
      });
  },
  beforeRouteLeave(to, from, next) {
    if (!this.haveBeenHandIn && this.countdown !== '00:00:00') {
      this.$confirm('考试途中不能退出, 是否交卷?', '提示', {
        confirmButtonText: '交卷',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handInExamPaper(next);
        })
        .catch(() => {});
    }
    if(this.haveBeenHandIn){
      next();
    }
  },
  beforeDestroy(){
    this.clearSocket();
  },
  methods: {
    initUserAnswer() {
      const userAnswer = JSON.parse(
        window.sessionStorage.getItem(
         `${this.currentExamID}.userAnswer`
        )
      );
      if (userAnswer && JSON.stringify(userAnswer) !== '{}') {
        Object.entries(userAnswer).forEach(([key, value]) => {
          this.$set(this.userAnswer, key, value);
        });
      }
    },
    initCountdown() {
      // const countdown = window.sessionStorage.getItem(
      //   `${this.currentExamID}.countdown`
      // );
      // if (countdown) {
      //   this.countdown = countdown;
      // } else {
      //   const hour = Math.floor(this.examTiming / 60);
      //   const mins = this.examTiming % 60;
        // this.countdown = `${hour < 10 ? '0' + hour : hour}:${
        //   mins < 10 ? '0' + mins : mins
        // }:00`;
      // }
      const countdown = this.examTiming * 60 * 1000 - this.timeDiff;
      let seconds = Math.floor(countdown / 1000);
      let mins = Math.floor(seconds / 60);
      let hour = Math.floor(mins / 60);
      seconds = Math.floor(seconds % 60);
      mins =  Math.floor(mins % 60);
      hour = Math.floor(hour % 24);
      this.countdown = `${hour < 10 ? '0' + hour : hour}:${
        mins < 10 ? '0' + mins : mins
      }:${seconds < 10 ? '0' + seconds : seconds}`;
    },
    autoEnding() {
      this.$alert('考试已结束，将自动交卷', '考试结束', {
        confirmButtonText: '确定',
        showClose: false
      }).then(() => {
        this.handInExamPaper(this.fresh);
      });
    },
    clearSocket(){
      this.socket.closed = true;
      this.socket.instance.close();
    },
    initSocket() {
      const socket = io(config.socketURL);
      this.socket.instance = socket;
      this.socket.closed = false;
      socket.emit('examStart', {
        delay: this.examTiming * 60 * 1000,
        timeDiff: this.timeDiff
      });
      socket.on('joinFail', (res) => {
        console.log(res);
      });
      socket.on('test', (res) => {
        console.log('test' + res.data);
      })
      socket.on('prompt', (res) => {
        const min = res.data.countdown;
        this.$notify({
          title: '提醒',
          message: `离考试结束还有${res.data.countdown / 60 / 1000}分钟，请抓紧时间答题`
          });
      });
      socket.on('examEnd', (res) => {
        this.serverEnded = true;
        console.log('examend');
        this.autoEnding();
      })
      socket.on('connect_error', (error) => {
        this.$message.error("网络连接错误，请检查网络连接以便考试顺利进行!");
      });
      socket.on('disconnect', (reason) => {
        if(!this.socket.closed){
          this.$message.error("网络连接中断，请检查网络连接以便考试顺利进行!");
        }
      });
      socket.on('reconnect', (attempt) => {
        this.$message({
          message: '网络连接恢复',
          type: 'success'
        });
      });
    },
    countdownTime() {
      let timer;
      this.countdownTimer = timer = setInterval(() => {
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
              // if(!this.serverEnded){
              //   this.autoEnding();
              // };
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
        // if (s === 0 && h === 0 && m === 15) {
        //   this.$message('离考试结束还有15分钟，请抓紧时间答题');
        // }

        // window.sessionStorage.setItem(
        //   `${this.currentExamID}.countdown`,
        //   this.countdown
        // );

      }, 1000);
    },
    getExamPaper() {
      ExamsProvider.getExamPaper({
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
            this.initSocket();
            this.countdownTime();
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
              confirmButtonText: '确定'
            }).then(() => {
              this.$router.push({path: `/course/${this.courseID}/exam`});
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
            confirmButtonText: '确定'
          }).then(() => {
            this.$router.push({path: `/course/${this.courseID}/exam`});
          });
        });
    },
    saveUserAnswerToSS() {
      window.sessionStorage.setItem(
        `${this.currentExamID}.userAnswer`,
        JSON.stringify(this.userAnswer)
      );
    },
    radio(label) {
      this.saveUserAnswerToSS();
    },
    checkbox(id, label) {
      if (Array.isArray(this.userAnswer[id])) {
        if (this.userAnswer[id].some(item => item === label)) {
          this.userAnswer[id] = this.userAnswer[id].filter(item => item !== label)
        } else {
          this.userAnswer[id].push(label)
        }
        this.userAnswer[id] = Array.from(new Set(this.userAnswer[id])).sort();
      } else {
        this.$set(this.userAnswer, id, [label]);
      }
      this.saveUserAnswerToSS();
    },
    handInExamPaper(afterExamCB) {
      ExamsProvider.handIn({
        courseID: this.courseID,
        examID: this.examID,
        userAnswer: this.userAnswer
      })
        .then(res => {
          if (res.data.code === 1) {
            this.haveBeenHandIn = true;
            clearInterval(this.countdownTimer);
            window.sessionStorage.removeItem(
              `${this.currentExamID}.userAnswer`
            );
            // window.sessionStorage.removeItem(
            //   `${this.currentExamID}.countdown`
            // );
            this.$alert(`您的成绩为${res.data.data.score}`, '您的成绩', {
              confirmButtonText: '确定',
              callback: action => {
                afterExamCB();
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
          this.handInExamPaper(this.fresh);
        })
        .catch(err => {});
    },
    fresh() {
      this.$router.replace({path: `/course/${this.courseID}/exam`});
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
