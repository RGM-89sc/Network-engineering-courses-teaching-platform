<template>
  <div class="qad__wrapper gray-bg">
    <Card class="question" shadow="always">
      <div class="question__main">
        <div class="user-info">        
          <a
            class="user-avatar"
            :style="{
              backgroundImage: `url(${question.questionerAvatar})`
            }"
            href="javascript:void(0);"
          ></a>
          <div class="question-meta__wrapper">
            <a class="user-name" type="primary" href="javascript:void(0);">{{
              question.questionerName
            }}</a>
            <div class="question-created normal-info-font">
              {{ question.created }}
            </div>
          </div>
        </div>
        
        <div class="question__desc">
          <div class="question__title">
            <h1>{{ question.title }}</h1>
          </div>
          <div
            v-html="question.content"
            class="question__content ck-content"
          ></div>
        </div>
        
      </div>
      <div class="question__footer">
        <div v-if="question.replys" class="normal-info-font">
          {{ question.replys.length }} 个回答
        </div>
        <div>
          <Tag
            :key="tag"
            v-for="tag in question.tags" color="#ecf5ff" font="#409eff" size="mini">
            {{ tag }}
          </Tag>
        </div>
      </div>
    </Card>
    <Card
      v-for="(reply, index) in question.replys"
      :key="index"
      class="reply"
      shadow="always"
    >
      <div class="reply__main">
        <div class="user-info">
            <a
              class="user-avatar"
              :style="{
                backgroundImage: `url(${reply.replyerAvatar})`
              }"
              href="javascript:void(0)"
            ></a>
            <div class="question-meta__wrapper">
              <a class="user-name" href="javascript:void(0)">{{
                reply.replyerName
              }}</a>
              <div class="reply-created normal-info-font">
                {{ reply.created }}
              </div>
            </div>
        </div>
        <div>
          <div class="reply__desc">
            <div
              class="reply__content ck ck-content"
              v-html="reply.content"
            ></div>
          </div>
        </div>
      </div>
    </Card>
    <div>
      <div>
        <p></p>
      </div>
    </div>
    <Card class="rich-text" shadow="always" >
      <div type="flex">
        <h2>撰写回答</h2>
      </div>
      <ckeditor
          class="answer-editor"
          ref="answerEditor"
          :editor="editor"
          v-model="reply.content"
          :config="editorConfig"
          :disabled="!isLogin"
      ></ckeditor>
      <div class="rich-text__footer">
        <md-button type="danger" @click="question.content = ''" inline size="small">
            清空内容
        </md-button>
        <md-button type="primary" @click="upload" inline size="small" :loading="postLoading">
            提交回答
        </md-button>
    </div>
    </Card>

  </div>
</template>

<script>
  import Tag  from "@/components/BaseTag";
  import Card  from "@/components/Card";
  //ck-editor
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
      user: {
        type: Object,
        default: {}
      }
    },

    data() {
      return {
        //post
        postLoading: false,

        question: {
          //replys: []
        },
        reply: {
          content: ''
        },

      //editor start
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
        //editor end


      }
    },
    computed: {
      isLogin() {
        return !!this.user.id;
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
        
        this.$http.post('getQaQuestion',{ 
          qaID: this.$route.params.question_id 
        })
          .then(res => {
            if (res.data.code === 1) {
              this.question = res.data.data;
              this.question.created = this.$dayjs(this.question.created).format('YYYY-MM-D');
              const replys = this.question.replys;
              for (let i of replys) {
                i.created = this.$dayjs(i.created).format('YYYY-MM-DD');
              }
            } else {
              this.$toast.failed('问题加载失败！');
              this.$router.push({ path: '/qa' });
            }
          })
          .catch(err => {
            console.log(err);
            this.$toast.failed('问题加载失败');
            this.$router.push({ path: '/qa' });
          })
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
        this.$toast.failed(`${message}不能为空！`);
      },
      uploadReply() {
        this.$dialog.confirm( {
          title: '确认',
          content: '是否提交回答',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm: () => {
            this.postLoading = true;

            this.$http.post(`updateQuestionReplys`,{
                qaID: this.question.qaID,
                reply: {
                  replyerID: this.user.id,
                  replyerName: this.user.username,
                  replyerType: this.user.userType === 1 ? 'teacher' : 'student',
                  replyerAvatar: this.user.avatar,
                  content: this.reply.content
                }
              }).then(res => {
                if (res.data.code === 1) {
                  this.$toast.succeed('提交成功！');
                  this.reply.content = ''
                  this.getQaQuestion();
                } else {
                  this.$toast.failed('提交失败！');
                }
              })
              .catch(err => {
                this.$toast.failed('提交失败！');
                console.log(err);
              })
              .finally(() => {
                this.postLoading = false;
              })
          }
        })
      },
      upload() {
        this.beforeUploadReply() && this.uploadReply();
      }
    },
    created() {
      this.getQaQuestion();
    },
    components: {
      Card,
      Tag
    }
  }
</script>
<style lang="scss">
p, a {
  color: #212529;
  line-height: 1.5;
  text-decoration: none;
}
</style>
<style lang="scss" scoped>
h1, h2, h3, h4, h5, h6, p {
  word-wrap: break-word;
  hyphens:auto;
  margin: 0;
}


a {
  color: #409eff;
  font-size: 0.75rem;
}
.normal-info-font {
  color: #999;
  font-size: 0.75rem;
}
img {
  max-width: 100%;
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
.question__desc, .reply__desc {
  margin-top: 1.2rem;
}
.question__content {
  margin-top: 1.5rem;
}
.question__title {
  h2 {
    margin-top: 5px;
    margin-bottom: 1em;
  }
}
.user-info {
  display: flex;
  padding: 0;
  .question-meta__wrapper {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  display: flex;
  justify-content: space-between;
}
.rich-text {
  margin-top: 20px;
}

.rich-text__footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.rich-text__header {
  margin-bottom: 20px;
}

</style>

<style lang="scss">
.answer-editor {
  + .ck-editor {
    margin-top: 1.5rem;
    > .ck-editor__main {
      > .ck-content {
        min-height: 20vh;
      }
    }
  }
}
</style>