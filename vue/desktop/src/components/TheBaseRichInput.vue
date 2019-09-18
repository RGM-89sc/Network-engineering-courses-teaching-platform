<template>
  <div class="base-rich-input">
    <div @click="checkIfLogin">
      <el-card class="rich-text" shadow="hover">
        <el-row type="flex">
          <h1>{{ currentMode.title }}</h1>
        </el-row>
        <el-row type="flex" justify="space-between" class="rich-text__header">
          <el-col :span="12">
            <el-input
              v-if="currentMode.hasTitle"
              v-model="question.title"
              maxlength="30"
              clearable
              show-word-limit
              placeholder="请输入问题的标题..."
              :disabled="disabled"
            ></el-input
          ></el-col>
          <el-col :span="6">
            <el-input
              v-if="currentMode.hasTags"
              v-model="question.tag"
              maxlength="12"
              clearable
              show-word-limit
              placeholder="为问题选择/输入一个标签..."
              :disabled="disabled"
            ></el-input>
          </el-col>
        </el-row>
        <ckeditor
          class="ckeditor_base"
          ref="questioningEditor"
          :editor="editor"
          v-model="question.content"
          :config="editorConfig"
          :disabled="disabled"
        ></ckeditor>
        <el-row class="rich-text__footer" type="flex" justify="space-between">
          <el-col :span="5">
            <el-button type="danger" @click="question.content = ''"
              >清空内容</el-button
            ></el-col
          >
          <el-col :span="2.5">
            <el-button type="primary" @click="$emit('upload')">{{
              currentMode.submitText
            }}</el-button></el-col
          >
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
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
  name: 'baseRichInput',
  props: {
    question: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      default: {}
    },
    uploadImageUrl: {
      type: String
    },
    mode: {
      type: String,
      default: () => {
        return 'questioning';
      }
    }
  },
  data() {
    return {
      questioning: {
        submitText: '提交问题',
        titleTips: '请输入问题的标题',
        hasTitle: true,
        tagsTips: '为问题输入/选择一个标签',
        hasTags: true,
        title: '提问题'
      },
      answering: {
        submitText: '提交回答',
        titleTips: '',
        hasTitle: false,
        tagsTips: '',
        hasTags: false,
        title: '回答问题'
      },
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
          uploadUrl: this.uploadImageUrl,
          options: {
            resourceType: '.jpg,.jpeg,.png'
          }
        }
      }
    };
  },
  computed: {
    currentMode() {
      return this.mode === 'questioning' ? this.questioning : this.answering;
    }
  },
  methods: {
    checkIfLogin() {
      this.$emit('checkIfLogin');
    }
  }
};
</script>

<style lang="scss">
.rich-text {
  margin-top: 20px;
}

.rich-text__footer {
  margin-top: 20px;
}
.rich-text__header {
  margin-bottom: 20px;
}
.ckeditor_base {
  + .ck-editor {
    > .ck-editor__main {
      > .ck-content {
        min-height: 30vh;
      }
    }
  }
}
</style>
