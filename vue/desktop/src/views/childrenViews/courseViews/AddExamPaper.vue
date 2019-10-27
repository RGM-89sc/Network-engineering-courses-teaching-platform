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
        <ExamMultipleChoice
          :questionType="choiceQuestion.questionType"
          :courseid="courseID"
          :exerciseid="examID"
          :questionid="choiceQuestion.id"
          v-model="choiceQuestion.detail"
          class="question-setting"
        ></ExamMultipleChoice>
      </el-card>
    </el-row>
    <el-row class="control">
      <el-button plain @click="addQuestion">添加题目</el-button>
    </el-row>
    <el-row class="add-exam">
      <el-form label-width="100px">
        <el-form-item label="考试名称：">
          <el-input
            placeholder="请输入作业名称（必填）"
            v-model="examName"
          ></el-input>
        </el-form-item>
        <el-form-item label="考试时长：">
          <el-input-number
            :min="30"
            v-model="examTiming"
            :step="5"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="考试有效期：">
          <el-date-picker
            v-model="startEndTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addExamPaper">发布考试</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import {ExamsProvider} from '@/provider/index';
import ExamMultipleChoice from '@/components/ExamMultipleChoiceEdit';
import uuid from 'uuid/v4';

export default {
  data() {
    return {
      courseID: '',
      examID: '',
      examName: '',
      choiceQuestions: [
        {
          id: 0,
          questionType: 'Exclusive',
          problem: '',
          detail: {}
        }
      ],
      startEndTime: [new Date(), new Date()],
      examTiming: 60
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
    this.examID = uuid()
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
    addExamPaper() {
      this.$confirm('考试发布后无法修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (
            (this.startEndTime[1] - this.startEndTime[0]) / 1000 / 60 <
            this.examTiming
          ) {
            this.$message({
              message: '考试有效期不能少于考试时长！',
              type: 'error'
            });
            return;
          }
          if (
            this.checkQuestionsInfo() &&
            this.examName &&
            this.startEndTime.length === 2 &&
            this.examTiming
          ) {
            ExamsProvider.addExamPaper({
              courseID: this.courseID,
              examID: this.examID,
              examName: this.examName,
              choiceQuestions: this.choiceQuestions,
              startTime: this.startEndTime[0],
              endTime: this.startEndTime[1],
              examTiming: this.examTiming
            })
              .then(res => {
                if (res.data.code === 1) {
                  this.$router.push({path: `/course/${this.courseID}/exam`});
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
            ExamsProvider.delQuestionImgs({imgs: question.detail.imgs})
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
    ExamMultipleChoice
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
.add-exam {
  padding-top: 20px;
  border-top: 1px solid #ddd;
  margin-bottom: 20vh;
}
</style>
