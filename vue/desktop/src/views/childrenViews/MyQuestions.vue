<template>
  <div>
    <el-card
      v-for="question in questions"
      :key="question.qaID"
      class="question"
      shadow="always"
    >
      <el-row>
        <el-col :span="18" class="question-name">
          <span @click="$router.push({path: `/qa/${question.id}`})">{{
            question.title
          }}</span>
        </el-col>
        <el-col :span="6" class="manipulate">
          <el-button type="danger" @click="delQuestion(question)"
            >删除</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-row v-if="questions.length === 0" class="question_empty">
      <span v-if="user">
        您还没有提过问题，去<el-button
          type="text"
          @click="$router.push({path: '/qa'})"
          >&nbsp;提问题</el-button
        >
        吧
      </span>
    </el-row>
  </div>
</template>
    
<script>
import {UserProvider} from '@/provider/index';
import {QaProvider} from '@/provider/index';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      questions: []
    };
  },
  methods: {
    getMyquestions() {
      //   const type = this.user.userType === 0 ? 'stu' : 'tch';
      UserProvider.student
        .getMyQuestions()
        .then(res => {
          if (res.code === 1) {
            this.questions = res.data;
          } else {
            this.$message({
              message: '获取信息失败!',
              type: 'fail'
            });
            console.error(res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delQuestion(question) {
      QaProvider.delQaQuestion()({
        qaID: question.qaID,
        questionerID: this.user.id
      })
        .then(res => {
          if (res.data.code === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else if (res.data.code === 0) {
            this.$message.error({
              message: res.data.data.info
            });
            console.log(res.data);
          } else {
            this.$message.error({
              message: '删除失败！'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getMyquestions();
  }
};
</script>
    
<style lang="scss" scoped>
.question {
  margin-bottom: 20px;

  .question-name {
    span {
      line-height: 40px;
      cursor: pointer;
    }
  }

  .manipulate {
    padding-right: 20px;
    text-align: right;
  }
}
.question_empty {
  padding: 5rem;
  text-align: center;
  color: #909090;

  font-size: 16px;
}
</style>