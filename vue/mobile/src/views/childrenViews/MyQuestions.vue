<template>
  <div>
    <Card
      v-for="question in questions"
      :key="question.qaID"
      class="question"
      shadow="always"
    >
      <div>
        
        <div class="question-name">
          <h3 @click="$router.push({path: `/qa/${question.id}`})">{{
            question.title
          }}</h3>
        </div>
        <div class="question__footer">
         
            <div class="question-date">
            {{ $dayjs(question.created).format('YYYY-MM-DD') }}
            </div>   
           <div class="manipulate">   
            <md-button :loading="delLoading" type="primary" size="small" inline @click="handleDelete(question)"
              >删除</md-button
            >
          </div>
        </div>

      </div>
    </Card>
    <div v-if="questions.length === 0" class="question_empty">
      <span v-if="user">
        您还没有提过问题，去<md-button
          type="link"
          @click="$router.push({path: '/qa'})"
          >&nbsp;提问题</md-button
        >
        吧
      </span>
    </div>
  </div>
</template>
    
<script>
import Card from '@/components/Card';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      questions: [],


      loadingPage: false,
      delLoading: false,
      questionerType: this.user.userType === 1 ? 'teacher' : 'student'
    };
  },
  methods: {
    getMyquestions() {
      const type = this.user.userType === 0 ? 'stu' : 'tch';
      this.loadingPage = true;
      this.$http.get(`${type}GetMyQuestions`)
        .then(res => {
          console.log(res)
          if (res.data.code === 1) {
            this.questions = res.data.data;
          } else {
            this.$toast.failed('获取信息失败!');
            console.error(res);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(_ => {
          this.loadingPage = false;
        });
    },
    handleDelete(question) {
      this.$dialog.confirm({
        title: '确认删除',
        content: '确认删除该问题？',
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => {
          this.delQuestion(question);
        }
      })
    },
    delQuestion(question) {
      this.delLoading = true;
      this.$http.post(`delQaQuestion`, {
        qaID: question.qaID,
        questionerID: this.user.id,
        questionerType: this.questionerType
      })
        .then(res => {
          if (res.data.code === 1) {
            this.$toast.succeed('删除成功');
          } else if (res.data.code === 0) {
            this.$toast.failed(res.data.data.info);
            console.log(res.data);
          } else {
            this.$toast.failed('删除失败！');
          }
          this.getMyquestions();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(_ => {
          this.delLoading = false;
        });
    }
  },
  created() {
    this.getMyquestions();
  },
  components: {
    Card
  }
};
</script>
    
<style lang="scss" scoped>
.question {
  margin: 1rem;

  .question-name {
    h3 {
      line-height: 1.5;
      font-size: 1rem;
      margin: 0;
      cursor: pointer;
    }
  }
}
  .question__footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    > .article-date {
        color: #909090;
        font-size: 0.8rem;
        align-self: center;
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