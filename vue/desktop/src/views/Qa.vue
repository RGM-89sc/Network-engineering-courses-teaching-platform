<template>
  <div class="qa">
    <el-row type="flex"
      ><el-col :span="5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/qa' }"
            >问题列表</el-breadcrumb-item
          >
          <el-breadcrumb-item v-show="canBreadCrumbItemShow"
            >问题详情</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col></el-row
    >
    <el-divider></el-divider>
    <el-row type="flex" align="middle" justify="center">
      <el-col> <router-view :user.sync="user"></router-view> </el-col
    ></el-row>

    <RichInput
      v-if="!canBreadCrumbItemShow"
      :question.sync="question"
      :disabled="!isLogin"
      :uploadImageUrl="
        `${$serverBaseUrl}/api/uploadQaImage?questionerID=${user.id}`
      "
      @upload="upload"
      mode="questioning"
      ref="qaRichInput"
    />
  </div>
</template>

<script>
import RichInput from '@/components/TheBaseRichInput';
import QaQuestions from './childrenViews/QaQuestions';

export default {
  name: 'qa',
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      question: {
        title: '',
        content: '',
        questionerID: '',
        questionerName: '',
        questionerAvatar: '',
        questionerType: '',
        tag: '',
        replys: []
      },
      uploadImageUrl: '',
      richInputMode: ''
    };
  },
  computed: {
    canBreadCrumbItemShow() {
      return this.$route.name === 'qa_question' ? true : false;
    },
    isLogin() {
      return this.user.id;
    }
  },
  watch: {
    $route: function() {
      this.richInputMode =
        this.richinputMode === 'questioning' ? 'answering' : 'questioning';
    },
    deep: true
  },
  methods: {
    beforeUploadQuestion(checkVals = { title: '标题', content: '问题内容' }) {
      const Q = this.question;
      for (let i in checkVals) {
        if (Q[i] === '') {
          this.emptyUploadToast(checkVals[i]);
          return false;
        }
      }
      return true;
    },
    uploadQuestion() {
      this.$confirm('是否确认提交问题?', '确认提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const url = '/api/uploadQuestion';
          this.$http
            .post(url, this.question)
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
              this.$message.error('提交失败');
              console.log(err);
            });
        })
        .catch(() => {});
    },
    upload() {
      this.beforeUploadQuestion() && this.uploadQuestion();
    },
    loginToast() {
      this.$alert('请先登录！', '登录提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({ path: '/auth' });
        }
      });
    },
    emptyUploadToast(message = '内容') {
      this.$message.error(`${message}不能为空！`);
    }
  },
  created() {
    if (this.isLogin) {
      const Q = this.question;
      Q.questionerID = this.user.id;
      Q.questionerName = this.user.username;
      Q.questionerAvatar = this.user.avatar;
      Q.questionerType = this.user.usertype;
      // Q.questionerFaculty = this.user.faculty;
    }
  },
  components: {
    QaQuestions,
    RichInput
  }
};
</script>

<style lang="scss" scoped>
* {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
.qa {
  width: 1100px;
  margin: 0 auto;
}
</style>
