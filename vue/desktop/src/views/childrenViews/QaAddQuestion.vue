<template>
  <div class="question-rich-input">
    <div @click="checkLoginStatus">
      <el-card class="rich-text" shadow="always" >
        <el-row type="flex" justify="space-between" class="rich-text__header">
          <el-col :span="24">
            <el-input
              v-model="question.title"
              maxlength="50"
              clearable
              show-word-limit
              placeholder="请输入问题的标题..."
              :disabled="!isLogin">
              </el-input>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="tags-row">
            <el-tag
              :key="tag"
              v-for="tag in tags"
              closable  
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else-if="addTag" class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>

        </el-row>

        <ckeditor
          class="question-ckeditor"
          ref="questionEditor"
          :editor="editor"
          v-model="question.content"
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
              提交问题
            </el-button></el-col
          >
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { QaProvider } from '@/provider/index'; 
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
  name: 'add_question',
	props: {
		user: {
			type: Object,
			default: {}
		}
	},
  data() {
    return {
      //input tags
      inputVisible: false,
      inputValue: '',
      tags: [],
      tagsLimit: 3,
      addTag: true,

      question: {
				title: '',
				content: '',
				questionerID: '',
				questionerName: '',
				questionerAvatar: '',
				questionerType: '',
				tags: [],
				replys: []
			},
			uploadImageUrl: `${this.$serverBaseUrl}/api/uploadQaImage?questionerID=${this.user.id}`,
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
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      if(this.tags.length < this.tagsLimit) {
        setTimeout( () => this.addTag = true, 500);
      }
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      const noRepeat = !this.tags.some( v => v === inputValue );
      if(!noRepeat) {
        this.$message.error('不能输入重复标签！')
      }
      if (inputValue && noRepeat) {
        this.tags.push(inputValue);
        if(this.tags.length === this.tagsLimit) {
          this.addTag = false;
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    checkLoginStatus() {
      !this.isLogin && this.loginToast();
    },
    beforeUploadQuestion(
			checkVals = { title: '标题', content: '问题内容' }
		) {
			if(!this.isLogin) return false;
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
					const Q = this.question;
					Q.questionerID = this.user.id;
					Q.questionerName = this.user.username;
					Q.questionerAvatar = this.user.avatar;
          Q.questionerType = this.user.userType === 1 ? 'teacher' : 'student';
          Q.tags = this.tags;
					QaProvider.uploadQaQuestion(Q)
						.then(res => {
							if (res.data.code === 1) {
								this.$message({
									message: '提交成功！',
									type: 'success'
								});
								this.$router.push({
									path: '/qa'
								});
							} else {
                console.error(res.data)
								this.$message.error(res.data);
							}
						})
						.catch(err => {
							this.$message.error(err);
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
.question-ckeditor {
  + .ck-editor {
    > .ck-editor__main {
      > .ck-content {
        min-height: 30vh;
      }
    }
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.tags-row {
  margin-bottom: 16px;
}
</style>
