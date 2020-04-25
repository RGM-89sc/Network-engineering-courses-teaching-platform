<template>
  <div class="gray-bg">
    <div class="header">
      <span class="exercise-name">{{exerciseName}}</span>
    </div>

    <div class="questions">
      <Card
        round
        v-for="(choiceQuestion, index) in choiceQuestions"
        :key="choiceQuestion.id"
        class="question"
      >
        <div class="question-info">
          <span v-if="checkedAnswer" class="result-mark">
            <md-icon v-show="resultMark[choiceQuestion.id]" name="success" color="green"></md-icon>
            <md-icon v-show="!resultMark[choiceQuestion.id]" name="fail" color="red"></md-icon>
          </span>
          <span class="question-index">第{{index + 1}}题</span>
          <span
            class="question-type"
          >[{{choiceQuestion.questionType === 'Exclusive' ? '单选题' : '多选题'}}]</span>：
          <span
            class="problem"
            :class="{ 'red-font': checkedAnswer && !resultMark[choiceQuestion.id] }"
          >{{choiceQuestion.problem}}</span>
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

        <div v-if="checkedAnswer" class="question-analyze">
          <span>[答案解析]：{{choiceQuestion.detail.analyze ? choiceQuestion.detail.analyze : '无'}}</span>
        </div>
      </Card>

      <div class="submit">
        <md-button type="primary" @click="checkAnswer">提 交</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';

export default {
  data() {
    return {
      courseID: '',
      exerciseID: '',
      exerciseName: '',
      choiceQuestions: [],
      userAnswer: {},
      rightAnswer: {},
      resultMark: {},
      checkedAnswer: false,
      path: `/course/${this.$route.params.course_id}/excercise`
    };
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.exerciseID = this.$route.query.id;
    if (!this.exerciseID) {
      this.$dialog.failed({
        title: '错误',
        content: '没有找到该作业！',
        confirmText: '确定',
        onConfirm: () => {
          this.$router.push({ path: this.path});
        }
      });
    } else {
      this.getExercisePaper();
    }
  },
  methods: {
    getExercisePaper() {
      this.$http
        .post('getExercisePaper', {
          courseID: this.courseID,
          exerciseID: this.exerciseID
        })
        .then(res => {
          if (res.data.code === 1) {
            this.exerciseName = res.data.data.exerciseName;
            this.choiceQuestions = res.data.data.choiceQuestions;
            this.extractRightAnswer();
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$dialog.failed({
              title: '获取数据失败',
              content: '发生了错误导致获取数据失败',
              confirmText: '确定',
              onConfirm: () => {
                this.$router.push({ path: this.path });
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
              this.$router.push({ path: this.path });
            }
          });
        });
    },
    extractRightAnswer() {
      this.choiceQuestions.forEach(question => {
        const selections = question.detail.selections;
        let right = [];
        selections.forEach(selection => {
          if (selection.isAnswer) {
            right.push(selection.id);
          }
        });
        this.rightAnswer[question.id] = right;
      });
    },
    checkAnswer() {
      this.$dialog.confirm({
        title: '提示',
        content: '请确认是否提交',
        confirmText: '确定',
        onConfirm: () => {
          this.choiceQuestions.forEach(question => {
            const selections = question.detail.selections;
            let isRight = false,
              userAnswer = this.userAnswer[question.id],
              rightAnswer = this.rightAnswer[question.id];
            userAnswer = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
            isRight =
              rightAnswer.every(val => {
                return userAnswer.indexOf(val) !== -1;
              }) && rightAnswer.length === userAnswer.length;
            this.$set(this.resultMark, question.id, isRight);
          });
          this.checkedAnswer = true;
          window.scrollTo(0, 0); // 滚动到页面顶部
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

  .exercise-name {
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

.red-font {
  color: red;
}

.submit {
  margin-bottom: 100px;
  padding: 0 1rem;
}
</style>
