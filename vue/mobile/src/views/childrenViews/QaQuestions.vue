<template>
  <div class="qa-wrapper gray-bg">
    <div class="qa-header">
      <md-button type="primary" inline size="small" @click="handleAddQuestion">
        + 提问题
      </md-button>
    </div>

    <div class="question-list">
      <md-scroll-view
      ref="scrollView"
      :scrolling-x="false"
      @end-reached="$_onEndReached">
        <div class="question"
            v-for="question in questions" 
              :key="question.qaID"
              @click="handleViewQuestion(question.qaID)">
          <div class="rank">
            <div class="answers info-block" :class="question.solved ? 'info-block__success' : ''">
              {{ question.replys.length}}
              <small>{{ question.solved ? '已解决' : '回答' }}</small>
            </div>
          </div>
          <div class="summary">
            <p class="summary-header">
              <span class="questioner">
                {{ question.questionerName }}
              </span>
              <span class="question-created">
                {{ formatDate(question.created, dayjsNowTime) }}提问
              </span>
            </p>

            <h1 class="question-title">
              {{ question.title }}
            </h1>

            <div class="question-tags" v-if="question.tags.length > 0">
              <Tag v-for="tag in question.tags" :key="question.qaID + tag" color="#ecf5ff" font="#409eff" size="mini">
                {{ tag }}
              </Tag>
            
            </div>
          </div>
        </div>
        <md-scroll-view-more
          slot="more"
          :is-finished="loadFinished">
        </md-scroll-view-more>
      </md-scroll-view>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '@/helpers/formatDate1';
  import Tag from '@/components/BaseTag';
  export default {
    props: {
      user: {
        type: Object,
        default: {}
      },
    }, 
    data() { 
      return {
        //scroll view
        loadFinished: false,
        currentSize: 0,
        loadSize: 5,
        totalSize: this.loadSize + 1,

        //const now 
        dayjsNowTime: this.$dayjs(Date.now()),
        //questions 
        questions: []
      }
    },
    methods: {
      $_onEndReached() {
        if (this.loadFinished) {
          return
        }
        // async data
        setTimeout(() => {
          this.getQaQuestions()
            .then(res => {
              if (res.data.code === 1) {
                console.log(res.data);
                this.questions = [...this.questions, ...res.data.data];
                this.currentSize += this.loadSize;
                if(this.currentSize >= this.totalSize ) {
                  this.loadFinished = true;
                }
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              this.$refs.scrollView.finishLoadMore();
            })
        }, 1000);
      },
      formatDate(date, now) {
        return formatDate(date, now, this.$dayjs);
      },
      handleAddQuestion() {
        this.$router.push({ 
          path:`${this.$route.path}/addQuestion` 
        });
      },
      getQaQuestions() {
       return this.$http.post('/getQaQuestions', {
         limits: this.loadSize,
         skips: this.currentSize,
       });
      },
      // http get
      getQaQuestionsSize() {
        this.$http.get(`getQaQuestionsSize`)
          .then(res => {
            console.log(res.data)
            const data = res.data;
            if(data.code === 1) {
              this.totalSize = data.data;
            }
          })
          .catch(err => {
            console.error(`获取问题总数失败！`, err);
          })
      },
      handleViewQuestion(qaID) {
        this.$router.push({
          path: `${this.$route.path}/question/${qaID}`
        })
      },

    },
    created() {
      this.getQaQuestionsSize();
      this.$_onEndReached();
    },
    components: {
      Tag
    },
  }
</script>

<style lang="scss" scoped>
p {
  line-height: 1.5;
}
.qa-wrapper {
    padding: 1rem;
    min-height: calc(100vh - 7.4rem);
    background-color: #fff;
}
.qa-header {
  display: flex;
  flex-direction: row-reverse;
}
.summary-header {
  color: #999;
  font-size: .75rem;
}
//scroll 容器需要有高度
.question-list {
  height: 80vh;
}
.question {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  padding: 1rem .5rem;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
.title {
  word-break: break-all;
}
.info-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #d9ecff;
    border-radius: .2rem;
    background-color: #ecf5ff;
    padding: .2rem;
    width: 36px;
    height: 32px;
    color: #1989fa;
}
.info-block__success {
  background-color: #2f86f6;
}
.summary {
  line-height: 1.5;
    margin-left: 16px;
}
.question-title {
  font-size: 1rem;
  margin: .25rem 0;
  font-weight: 400;
}
.question:nth-child(odd) {
  background-color: #FFF9EB;
}
</style>