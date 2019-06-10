<template>
  <div class="qad">
    <el-card class="qad-question" shadow="hover">
      <el-row type="flex" justify="space-between" class="qad-question__main">
        <el-col :span="3">
          <el-card class="qad-questioner-info" shadow="hover">
            <a
              class="qad-questioner-info-avatar"
              :style="{ backgroundImage: `url(${question.questionerAvatar})` }"
              href="/myInfo"
            ></a>
            <el-link
              class="qad-questioner-name"
              type="primary"
              href="/myInfo"
              >{{ question.questionerName }}</el-link
            >
            <p v-if="question.questionerFaculty">
              {{ question.questionerFaculty }}
            </p>
            <p v-if="question.questionerMajor">
              {{ question.questionerMajor }}
            </p>
            <p>{{ question.questionerType }}</p>
            <p>{{ question.created }}</p>
          </el-card></el-col
        >
        <el-col :span="20">
          <div class="qad-question__desc">
            <div class="qad-question__title">
              <h1>{{ question.title }}</h1>
            </div>
            <div
              v-html="question.content"
              class="qad-question__content ck-content"
            ></div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="3"> {{ question.replys.length }} 个回答 </el-col>
        <el-col :span="6">
          <el-tag
            :key="tag"
            v-for="tag in question.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-for="(reply, index) in question.replys"
      :key="index"
      class="qad-reply"
      shadow="hover"
    >
      <el-row type="flex" justify="space-between" class="qad-reply__main">
        <el-col :span="3">
          <el-card class="qad-replyer-info" shadow="hover">
            <a
              class="qad-replyer-info-avatar"
              :style="{ backgroundImage: `url(${reply.replyerAvatar})` }"
              :href="reply.replyerAvatar"
            ></a>
            <el-link
              :underline="false"
              class="qad-replyer-name"
              type="primary"
              >{{ reply.replyerName }}</el-link
            >
            <p>{{ reply.created }}</p>
          </el-card></el-col
        >
        <el-col :span="20">
          <div class="qad-reply__desc">
            <div
              class="qad-reply__content ck ck-content"
              v-html="reply.content"
            ></div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col>
        <p></p>
      </el-col>
    </el-row>
    <el-row v-if="question.replys.length" class="replylist-index">
      <el-col>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="this.offset"
          layout="prev, pager, next, jumper"
          :total="totalItems"
          @current-change="handleCurPageChange"
          background
        >
        </el-pagination>
      </el-col>
    </el-row>
    <RichInput
      :question.sync="reply"
      :disabled="!user.id"
      :uploadImageUrl="
        `${$serverBaseUrl}/api/uploadQaImage?replyerID=${user.id}`
      "
      @upload="upload"
      mode="answering"
    />
  </div>
</template>

<script>
import RichInput from '@/components/TheBaseRichInput';
export default {
  name: 'qad',
  props: {
    // question: {
    //   type: Object
    // },
    user: {
      type: Object
    }
  },
  data() {
    return {
      question: {
        replys: []
      },
      reply: {
        content: ''
      },
      index: 0,
      offset: 8
    };
  },
  computed: {
    totalItems() {
      return this.question.replys.length;
    },
    currentPageReplysCount() {
      return this.question.replys.slice(this.index, this.index + this.offset);
    }
  },
  methods: {
    handleCurPageChange(val) {
      this.index = (val - 1) * this.offset;
    },
    loadQuesiton() {
      const url = '/api/loadQuestion';
      const qaID = this.$route.params.question_id;
      this.$http
        .post(url, { qaID: qaID })
        .then(res => {
          if (res.data.code === 1) {
            const totalMinutesPerDay = 1440;
            this.question = res.data.data;
            console.log(this.$dayjs().utcOffset(this.question.created));
            console.log(this.$dayjs(Date.now()));
            this.question.created = this.$dayjs(this.question.created).format(
              'YYYY-MM-DD 提问'
            );
            const replys = this.question.replys;
            for (let i of replys) {
              i.created = this.$dayjs(i.created).format('YYYY-MM-DD 回答');
            }
            console.log(this.user);
          } else {
            this.$message.error('问题加载失败！');
            this.$router.push({ path: '/qa' });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error('问题加载失败');
          this.$router.push({ path: '/qa' });
        });
    },
    beforeUploadReply(checkVals = { content: '答案内容' }) {
      const Q = this.reply;
      for (let i in checkVals) {
        if (Q[i] === '') {
          this.emptyUploadToast(checkVals[i]);
          return false;
        }
      }
      return true;
    },
    emptyUploadToast(message = '内容') {
      this.$message.error(`${message}不能为空！`);
    },
    uploadReply() {
      this.$confirm('是否确认提交回答?', '确认提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const url = '/api/updateQuestionReplys';
          this.$http
            .post(url, {
              qaID: this.question.qaID,
              reply: {
                replyerName: this.user.username,
                replyerType: this.user.usertype,
                replyerAvatar: this.user.avatar,
                content: this.reply.content
              }
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                });
              } else {
                this.$message.error('提交失败！');
              }
            })
            .catch(err => {
              this.$message.error('提交失败！');
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload() {
      this.beforeUploadReply() && this.uploadReply();
    }
  },
  created() {
    this.loadQuesiton();
  },
  components: {
    RichInput
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>

<style lang="scss">
$FONT_SIZE: 16px;

.qad-question,
.qad-reply {
  margin-bottom: 20px;
}
.qad-question__main,
.qad-reply__main {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e6e8;
}
.qad-question__title {
  border-bottom: 1px solid #eee;
  h2 {
    margin-top: 5px;
    margin-bottom: 1em;
  }
}
.qad-questioner-info,
.qad-replyer-info {
  p {
    color: #999;
    font-size: 13px;
  }
  .el-card__body {
    padding: 0;
    padding-left: 5px;
  }
}
.qad-questioner-info-avatar,
.qad-replyer-info-avatar {
  display: block;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  background-size: 100% 100%;
  margin: 5px 0;
}
.qad-question__footer {
  margin-top: 20px;
}
</style>
