<template>
  <div class="add-article__wrapper">
    <Card class="add-article__content">
      <div class="add-article-title">
        <input
          class="input-title"
          v-model="article.title"
          placeholder="请输入标题..."/>
        <input
          class="input-summary"
          placeholder="简单概括一下文章内容"
          maxlength="64"
          v-model="article.summary"/>
      </div>
      <ckeditor
        class="post-article-editor"
        :editor="editor"
        v-model="article.content"
        :config="editorConfig"
      ></ckeditor>
      <div>
        <md-button @click="postArticle" type="primary">发布文章</md-button>
      </div>
    </Card>
  </div>
</template>

<script>
  import Card from '@/components/Card';


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

  import uuid from 'uuid/v4';

  export default {
    props: {
      user: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        article: {
          articleID: uuid().split('-').join(''),
          title: '',
          authorName: '',
          authorID: '',
          avatarURL: '',
          views: 0,
          tags: [],
          content: '',
          summary: '',
          posterURL: '/static/img/poster.png'
        },
        //editor start
        uploadUrl: `${this.$serverBaseUrl}/api/postArticleImage?articleID=${this.articleID}&articleType=${this.$route.query.articleType}`,
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
        },
      //editor end
      }
    },
    methods: {
      //判断
      beforePost() {
        const article = this.article;
        return article.summary === '' ||
          article.title === '' ||
          article.content === ''
          ? false
          : true;
      },
      postArticle() {
          if (!this.beforePost()) {
            this.$dialog.alert({
              title: '发布失败',
              content: '请将 内容/标题/概述 填写完整！',
              confirmButtonText: '确定',
              callback: action => {}
            });
          } else {
            this.$dialog.confirm({
              title: '确认',
              content: '是否确认发布文章？',
              confirmText: '确认',
              cacelText: '取消',
              type: 'warning',
              onConfirm: () => {
                // this.article.articleID = this.$route.query.articleID;
                this.article.authorName = this.user.username;
                this.article.authorID = this.user.id;
                this.article.avatarURL = this.user.avatar;
                this.article.articleType = this.$route.query.articleType;
                this.article.tags.push(
                  this.article.articleType === 'techInfo' ? '技术前沿' : '新闻动态'
                );
                this.$http.post(`postArticle`, this.article)
                  .then(res => {
                    if (res.data.code === 1) {
                      this.$toast.succeed( '发布成功！');
                      this.$router.push({path: `/${this.article.articleType}`});
                    } else {
                      this.$toast.failed('发布失败！');
                      console.log(res.data.errMsg);
                    }
                  })
                  .catch(err => {
                    this.$toast.failed('发布失败！');
                    console.log(err);
                  });
              }
          })
        }
      }
    },
    created() {
      console.log(this.$route)
    },
    components: {
      Card
    },
  }
</script>

<style lang="scss" scoped>
.input-title, .input-summary {
    display: block;
    width: 100%;
    font-weight: 400;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    height: calc(1.5em + 1rem + 2px);
    padding: .5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem;
    box-sizing: border-box;
}
.input-summary {
  height: calc(2em + 2px);
  font-size: 1rem;
  margin-top: 1rem;
}
.input-title:focus, .input-summary:focus {
  color: #495057;
  background-color: #fff;
  border-color: #62acf5;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(3, 169, 244, 0.25)
}

</style>

<style lang="scss">
.post-article-editor {
  + .ck-editor {
    margin-top: 24px;
    > .ck-editor__main {
      > .ck-content {
        min-height: 50vh;
      }
    }
  }
}

</style>