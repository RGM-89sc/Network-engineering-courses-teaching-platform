<template>
  <div>
    <el-row
      v-for="(choiceQuestion, index) in choiceQuestions"
      :key="choiceQuestion.id"
    >
      <el-card class="question" shadow="hover">
        <el-row class="question-header">
          <el-col :span="12" class="question-index">
            <span>第{{ index + 1 }}题</span>
          </el-col>
          <el-col :span="12" class="question-control">
            <el-button type="text" @click="delQuestion(choiceQuestion.id)"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-input
          placeholder="请输入题干（必填）"
          v-model="choiceQuestion.problem"
        >
          <el-select
            style="width: 120px;"
            v-model="choiceQuestion.questionType"
            slot="prepend"
            placeholder="请选择题型"
          >
            <el-option label="单选题" value="Exclusive"></el-option>
            <el-option label="多选题" value="Multiple"></el-option>
          </el-select>
        </el-input>
        <MultipleChoice
          :questionType="choiceQuestion.questionType"
          :courseid="courseID"
          :exerciseid="exerciseID"
          :questionid="choiceQuestion.id"
          v-model="choiceQuestion.detail"
          class="question-setting"
        ></MultipleChoice>
      </el-card>
    </el-row>
    <el-row class="control">
      <el-button plain @click="addQuestion">添加题目</el-button>
    </el-row>
    <el-row class="add-exerise">
      <el-col :span="20">
        <el-input placeholder="请输入作业名称（必填）" v-model="exerciseName">
          <template slot="prepend"
            >作业名称：</template
          >
        </el-input>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" @click="addExercisePaper">创建作业</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ExercisesProvider} from '@/provider/index';
import MultipleChoice from '@/components/MultipleChoiceEdit';
import uuid from 'uuid/v4';

export default {
  data() {
    return {
      courseID: '',
      exerciseID: '',
      exerciseName: '',
      choiceQuestions: [
        {
          id: 0,
          questionType: 'Exclusive',
          problem: '',
          detail: {}
        }
      ]
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
    this.exerciseID = uuid()
      .split('-')
      .join('');
  },
  methods: {
    // 检查表单必填项是否都已填好
    checkQuestionsInfo() {
      // 检查选项内容是否都填好了
      function nacf(selections) {
        return selections.some(selection => {
          return !selection.content;
        });
      }
      // 检查正确答案设置了没
      function ac(selections) {
        return selections.some(selection => {
          return selection.isAnswer;
        });
      }
      return !this.choiceQuestions.some(question => {
        if (!question.problem) {
          return true; // 有题干没填
        }
        if (!question.detail.selections) {
          // 压根没写题目的详细内容
          return true;
        }
        const notAllContentFilled = nacf(question.detail.selections);
        const answerChose = ac(question.detail.selections);
        if (notAllContentFilled || !answerChose) {
          // 有选项内容没填或者没有设置正确答案
          return true;
        }
        return false;
      });
    },
    addExercisePaper() {
      this.$confirm('此操作将创建作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.checkQuestionsInfo() && this.exerciseName) {
            ExercisesProvider.addExercisePaper({
              courseID: this.courseID,
              exerciseID: this.exerciseID,
              exerciseName: this.exerciseName,
              choiceQuestions: this.choiceQuestions
            })
              .then(res => {
                if (res.data.code === 1) {
                  this.$router.push({path : `/course/${this.courseID}/exercise`})
                }
                if (res.data.code === -1) {
                  this.$alert('发生了错误导致创建失败', '创建失败', {
                    confirmButtonText: '确定'
                  });
                  console.log(res.data.errMsg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message({
              message: '请先把必填项填写完成再提交！',
              type: 'warning'
            });
          }
        })
        .catch(err => {});
    },
    getQuestionID() {
      let ids = [];
      this.choiceQuestions.forEach(choiceQuestion => {
        ids.push(choiceQuestion.id);
      });
      if (ids.length === 0) {
        return 0;
      }
      return Math.max(...ids) + 1;
    },
    delQuestion(id) {
      if (this.choiceQuestions.length === 1) {
        this.$alert('请至少保留1道题！', '提示', {
          confirmButtonText: '确定'
        });
        return null;
      }
      this.choiceQuestions = this.choiceQuestions.filter(question => {
        if (question.id === id) {
          if (question.detail.imgs.length > 0) {
            // 删除该题目的所有配图
            ExercisesProvider.delQuestionImgs({
              imgs: question.detail.imgs
            })
              .then(res => {})
              .catch(err => {});
          }

          return false;
        }
        return true;
      });
    },
    addQuestion() {
      this.choiceQuestions.push({
        id: this.getQuestionID(),
        questionType: 'Exclusive',
        problem: '',
        detail: {}
      });
    }
  },
  components: {
    MultipleChoice
  }
};
</script>

<style lang="scss" scoped>
.question {
  margin-bottom: 20px;
}
.question-setting {
  padding: 20px 0;
}
.question-header {
  margin-bottom: 20px;

  .question-index {
    span {
      line-height: 40px;
      font-weight: bold;
    }
  }
  .question-control {
    text-align: right;
  }
}
.control {
  text-align: center;
  margin-bottom: 30px;
}
.add-exerise {
  padding-top: 20px;
  border-top: 1px solid #ddd;
  margin-bottom: 20vh;
}
</style>
