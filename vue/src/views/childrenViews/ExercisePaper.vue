<template>
  <div>
    <el-row class="header">
      <el-col>
        <span class="exercise-name">{{exerciseName}}</span>
      </el-col>
    </el-row>
    <el-row class="questions">
      <el-card
        v-for="(choiceQuestion, index) in choiceQuestions"
        :key="choiceQuestion.id"
        class="question"
      >
        <el-row class="question-info">
          <span v-if="checkedAnswer" class="result-mark">
            <i v-show="resultMark[choiceQuestion.id]" class="el-icon-success result-mark-success"></i>
            <i v-show="!resultMark[choiceQuestion.id]" class="el-icon-error result-mark-error"></i>
          </span>
          <span class="question-index">第{{index + 1}}题</span>
          <span
            class="question-type"
          >[{{choiceQuestion.questionType === 'Exclusive' ? '单选题' : '多选题'}}]</span>：
          <span
            class="problem"
            :class="{ 'red-font': checkedAnswer && !resultMark[choiceQuestion.id] }"
          >{{choiceQuestion.problem}}</span>
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
        <el-row v-if="checkedAnswer" class="question-analyze">
          <span>[答案解析]：{{choiceQuestion.detail.analyze ? choiceQuestion.detail.analyze : '无'}}</span>
        </el-row>
      </el-card>
    </el-row>
    <el-row type="flex" justify="center" class="submit">
      <el-button type="primary" @click="checkAnswer">提 交</el-button>
    </el-row>
  </div>
</template>

<script>
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
      checkedAnswer: false
    };
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.exerciseID = this.$route.query.id;
    if (!this.exerciseID) {
      this.$alert('没有找到该作业！', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
        .then(() => {
          this.$router.push({ path: `/exercise/${this.courseID}` });
        })
        .catch(() => {});
    } else {
      this.getExercisePaper();
    }
  },
  methods: {
    getExercisePaper() {
      this.$http
        .post('/api/getExercisePaper', {
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
            this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
              confirmButtonText: '确定'
            }).then(() => {
              this.$router.push({ path: `/exercise/${this.courseID}` });
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$alert('发生了错误导致获取数据失败', '获取数据失败', {
            confirmButtonText: '确定'
          }).then(() => {
            this.$router.push({ path: `/exercise/${this.courseID}` });
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
    checkbox(id, label) {
      if (Array.isArray(this.userAnswer[id])) {
        this.userAnswer[id] = this.userAnswer[id].sort();
      } else {
        this.$set(this.userAnswer, id, [label]);
      }
    },
    checkAnswer() {
      this.$confirm('请确认是否提交', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
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
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;

  .exercise-name {
    font-size: 1.2rem;
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

        .result-mark-success {
          color: green;
        }

        .result-mark-error {
          color: red;
        }
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
}
</style>
