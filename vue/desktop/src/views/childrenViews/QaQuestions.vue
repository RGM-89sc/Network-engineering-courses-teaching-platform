<template>
  <div name="qa-view" class="qa-view">
    <div class="cmt">
      <el-row class="cmt__header" type="flex" justify="space-between">
        <el-col :span="5">
          <el-select v-model="selectData.value" placeholder="请选择">
            <el-option
              v-for="item in selectData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入搜索内容..."
            v-model="searchData.value"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-col>
      </el-row>
      <div class="cmt-content">
        <el-row>
          <el-col>
            <div class="cmt__content__table">
              <el-table
                :data="singlePageQuestions"
                stripe
                highlight-current-row
                :loading="loading"
              >
                <el-table-column prop="title" label="标题" align="left">
                </el-table-column>
                <!-- <el-table-column prop="specialty" label="专业" align="left">
                </el-table-column> -->
                <el-table-column
                  prop="questionerName"
                  label="姓名"
                  align="left"
                >
                </el-table-column>
                <el-table-column prop="tag" label="问题标签" align="left">
                </el-table-column>
                <el-table-column
                  prop="created"
                  label="提出时间"
                  sortable
                  align="left"
                >
                </el-table-column>
                <el-table-column
                  prop="replysLength"
                  label="回答数"
                  sortable
                  align="left"
                ></el-table-column>
                <el-table-column label="" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini " @click="viewQuestionDetails(scope)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div></el-col
          >
        </el-row>
      </div>

      <el-row class="cmt-index">
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
    </div>
    <RichInput
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
export default {
  name: 'qaview',
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      selectData: {
        options: [],
        value: ''
      },
      searchData: {
        value: ''
      },
      /*Questions Data STARTS*/
      questions: [],
      index: 0,
      offset: 8,
      /*Questions Data ENDS*/
      loading: true,
      currentPage: 1,
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
    isLogin() {
      return this.user.id;
    },
    totalItems() {
      return this.questions.length;
    },
    singlePageQuestions() {
      return (
        this.searchQuestions ||
        this.questions.slice(this.index, this.index + this.offset)
      );
    },
    searchQuestions() {
      return this.questions.filter(question => {
        return new RegExp(this.searchData.value, 'i').test(question.title);
      });
    }
  },
  methods: {
    handleCurPageChange(val) {
      this.index = (val - 1) * this.offset;
    },
    viewQuestionDetails(scope) {
      this.$router.push({ path: `${this.$route.path}/${scope.row.qaID}` });
    },
    getQaQuestions() {
      const url = '/api/getQaQuestions';
      let data = [];
      this.$http
        .get(url)
        .then(res => {
          if (res.data.code === 1) {
            this.questions = res.data.data;
            for (let i of this.questions) {
              i.created = this.$dayjs(i.created).format('YYYY-MM-DD');
              i['replysLength'] = i.replys.length;
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    },
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
          const url = '/api/uploadQaQuestion';
          this.$http
            .post(url, this.question)
            .then(res => {
              if (res.data.code === 1) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                });
                // this.getQaQuestions();
                this.$router.push({
                  path: '/emptyPage'
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
    this.getQaQuestions();
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
    RichInput
  }
};
</script>

<style lang="scss" scoped>
.cmt {
  display: flex;
  flex-direction: column;
}
.cmt__header {
  padding-bottom: 20px;
}
.cmt-index {
  margin-top: 50px;
}
.cmt__content__table {
  min-height: 490px;
}
.el-pagination {
  margin-left: -10px;
}
</style>
