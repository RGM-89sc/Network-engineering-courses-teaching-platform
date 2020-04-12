<template>
  <div class="add-article__wrapper">
    <el-card class="add-article__content">
      <div class="add-article-title">
        <el-input
          v-model="article.title"
          placeholder="无标题"
          :maxlength="64"
          :clearable="true"
        ></el-input>
      </div>
      <ckeditor
        class="post-article-editor"
        :editor="editor"
        v-model="article.content"
        :config="editorConfig"
      ></ckeditor>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-input
            placeholder="简单概括一下文章内容"
            :maxlength="64"
            :clearble="true"
            v-model="article.summary"
        /></el-col>

        <el-button @click="postArticle" type="primary">发布文章</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {ArticleProvider} from '../../provider/index';

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
        articleID: '',
        title: '',
        authorName: '',
        authorID: '',
        avatarURL: '',
        views: 0,
        goods: [],
        tags: [],
        content: '',
        summary: '',
        posterURL: '/static/img/poster.png'
      },
      titleInput: '',
      editor: ClassicEditor,
      editorData: '',
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
            'imageStyle:full',
            'imageStyle:side',
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
          uploadUrl: `${this.$serverBaseUrl}/api/postArticleImage?articleID=${this.$route.query.articleID}&type=${this.$route.query.type}`,
          options: {
            resourceType: '.jpg,.jpeg,.png'
          }
        }
      }
    };
  },
  created() {
    console.log(this.user);
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
        this.$alert('请将 内容/标题/概述 填写完整！', '发布失败', {
          confirmButtonText: '确定',
          callback: action => {}
        });
      } else {
        this.$confirm('是否确认发布文章？', '确认发布', {
          confirmButtonText: '确定',
          cacelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.article.articleID = this.$route.query.articleID;
          this.article.authorName = this.user.username;
          this.article.authorID = this.user.id;
          this.article.avatarURL = this.user.avatar;
          this.article.articleType = this.$route.query.articleType;
          this.article.tags.push(
            this.article.articleType === 'techInfo' ? '技术前沿' : '新闻动态'
          );
          ArticleProvider.postArticle(this.article)
            .then(res => {
              if (res.data.code === 1) {
                this.$message({
                  message: '发布成功！',
                  type: 'success'
                });
                this.$router.push({path: `/${this.article.articleType}`});
              } else {
                this.$message.error('发布失败！');
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              this.$message.error('发布失败！');
              console.log(err);
            });
        });
      }
    }
  }
};
</script>

<style lang="scss">
.add-article__content {
  > div {
    padding: 20px;
  }
}
.add-article__wrapper {
  min-width: 960px;
}
.post-article-editor {
  + .ck-editor {
    margin: 24px 0 20px 0;
    > .ck-editor__main {
      > .ck-content {
        min-height: 62vh;
      }
    }
  }
}
.add-article-title {
  > .el-input {
    > input {
      height: 10vh;
      font-weight: 700;
      font-size: 36px;
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
      color: #000;
      padding: 0;
    }
  }
}
</style>