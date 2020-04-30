<template>
  <div class="qad__wrapper">
    <el-card class="question" shadow="always">
      <el-row type="flex" justify="space-between" class="question__main">
        <el-card class="user-info" shadow="never">
          <el-row type="flex" justify="space-between">
            <a
              class="user-avatar"
              :style="{
                backgroundImage: `url(${question.questionerAvatar})`
              }"
              href="javascript:void(0);"
            ></a>
            <div class="question-meta__wrapper">
              <el-link class="user-name" type="primary" href="javascript:void(0);">{{
                question.questionerName
              }}</el-link>
              <div class="question-created normal-info-font">
                {{ question.created }}
              </div>
            </div>
          </el-row>
          <p v-if="question.questionerFaculty">
            {{ question.questionerFaculty }}
          </p>
          <p v-if="question.questionerMajor">
            {{ question.questionerMajor }}
          </p>
          <p>{{ question.questionerType }}</p>
        </el-card>
        <el-col :span="19">
          <div class="question__desc">
            <div class="question__title">
              <h1>{{ question.title }}</h1>
            </div>
            <div
              v-html="question.content"
              class="question__content ck-content"
            ></div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="3" class="normal-info-font">
          {{ question.replys.length }} 个回答
        </el-col>
        <el-col :span="6">
          <el-tag
            :key="tag"
            v-for="tag in question.tags"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-for="(reply, index) in question.replys"
      :key="index"
      class="reply"
      shadow="always"
    >
      <el-row type="flex" justify="space-between" class="reply__main">
        <el-card class="user-info" shadow="never">
          <el-row type="flex" justify="space-between">
            <a
              class="user-avatar"
              :style="{
                backgroundImage: `url(${reply.replyerAvatar})`
              }"
              href="/myInfo"
            ></a>
            <div class="question-meta__wrapper">
              <el-link class="user-name" type="primary" href="/myInfo">{{
                reply.replyerName
              }}</el-link>
              <div class="reply-created normal-info-font">
                {{ reply.created }}
              </div>
            </div>
          </el-row>
        </el-card>
        <el-col :span="19">
          <div class="reply__desc">
            <div
              class="reply__content ck ck-content"
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
    <el-card class="rich-text" shadow="always" >
      <el-row type="flex">
        <h1>回答问题</h1>
      </el-row>
      <ckeditor
          class="answer-editor"
          ref="answerEditor"
          :editor="editor"
          v-model="reply.content"
          :config="editorConfig"
          :disabled="!isLogin"
      ></ckeditor>
      <el-row class="rich-text__footer" type="flex" justify="space-between">
        <el-col :span="5">
          <el-button type="danger" @click="question.content = ''"
            >清空内容</el-button
          ></el-col
        >
        <el-col :span="2.5">
          <el-button type="primary" @click="upload">
            提交回答
          </el-button></el-col
        >
      </el-row>
    </el-card>

  </div>
</template>

<script>
import { QaProvider } from '../../provider'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import FontPlugin from '@ckeditor/ckeditor5-font/src/font';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment';
import SuperScriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';

export default {
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
      currentPage: 1,
      question: {
        replys: []
      },
      reply: {
        content: ''
      },
      index: 0,
      offset: 8,
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          FontPlugin,
          UnderlinePlugin,
          AlignmentPlugin,
          SuperScriptPlugin,
          CodePlugin,
          LinkPlugin,
          ParagraphPlugin,
          CKFinder,
          Image,
          ImageToolbar,
          ImageUpload,
          ImageCaption,
          ImageStyle
        ],

        toolbar: {
          items: [
            'heading',
            '|',
            'link',
            'imageUpload',
            // 'imageStyle:full',
            // 'imageStyle:side',
            '|',
            'bold',
            'italic',
            'fontSize',
            'underline',
            'superscript',
            'code',
            '|',
            'alignment:left',
            'alignment:right',
            'alignment:center',
            'alignment:justify',
            '|',
            'undo',
            'redo'
          ]
        },

        ckfinder: {
          // Upload the images to the server using the CKFinder QuickUpload command.
          uploadUrl: `${this.$serverBaseUrl}/api/uploadQaImage?questionerID=${this.user.id}`,
          options: {
            resourceType: '.jpg,.jpeg,.png'
          }
        }
      }

    };
  },
  computed: {
    isLogin() {
      return !!this.user.id;
    },
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
    getQaQuestion() {
      QaProvider.getQaQuestion({ qaID: this.$route.params.question_id })
        .then(res => {
          if (res.data.code === 1) {
            this.question = res.data.data;
            this.question.created = this.$dayjs(this.question.created).format('YYYY-MM-D');
            const replys = this.question.replys;
            for (let i of replys) {
              i.created = this.$dayjs(i.created).format('YYYY-MM-DD');
            }
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
          QaProvider.updateQuestionReplys({
              qaID: this.question.qaID,
              reply: {
                replyerID: this.user.id,
                replyerName: this.user.username,
                replyerType: this.user.usertype,
                replyerAvatar: this.user.avatar,
                content: this.reply.content
              }
            }).then(res => {
              if (res.data.code === 1) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                });
                this.reply.content = ''
                this.getQaQuestion();
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
    this.getQaQuestion();
  }
};
</script>

<style lang="scss" scoped>
.qad__wrapper {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>

<style lang="scss">
$FONT_SIZE: 16px;
.normal-info-font {
  color: #999;
  font-size: 14px;
}
.question,
.reply {
  margin-bottom: 20px;
}
.question__main,
.reply__main {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e6e8;
}
.question__title {
  h2 {
    margin-top: 5px;
    margin-bottom: 1em;
  }
}
.user-info {
  height: 100px;
  .question-meta__wrapper {
    padding-left: 15px;
  }
  .el-card__body {
    padding: 20px;
    padding-left: 10px;
    border: 0;
  }
  .el-row {
    align-items: center;
  }
}
.user-avatar {
  display: block;
  box-sizing: border-box;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-size: 100% 100%;
  border: 1px solid rgba(192, 192, 192, 0.5);
}
.question__footer {
  margin-top: 20px;
}
.rich-text {
  margin-top: 20px;
}

.rich-text__footer {
  margin-top: 20px;
}
.rich-text__header {
  margin-bottom: 20px;
}
.answer-editor {
  + .ck-editor {
    > .ck-editor__main {
      > .ck-content {
        min-height: 30vh;
      }
    }
  }
}
</style>
