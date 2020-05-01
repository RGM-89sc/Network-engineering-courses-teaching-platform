<template>
  <div :class="true ? 'gray-bg' : ''">
    <div class="aq-wrapper">
      <input class="input-title" type="text" v-model="question.title" placeholder="请输入标题...">
      <div class="add-tags">

        <Tag v-for="tag in tags" :key="tag" 
            closable @close="handleClose(tag)">
          {{ tag }}
        </Tag>

        <input 
            v-if="inputTagVisible"
            class="input-tag" 
            type="text" 
            v-model="inputTag" 
            placeholder="+ 新标签"    
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm" />
      </div>

      <ckeditor
        class="question-ckeditor"
        ref="questionEditor"
        :editor="editor"
        v-model="question.content"
        :config="editorConfig"
        :disabled="!isLogin"
      ></ckeditor>

      <md-button type="primary" @click="upload">
        提交
      </md-button>
    </div>


  </div>
</template>

<script>
  import Tag from '@/components/BaseTag';
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
        //question tags
        tags: [],
        inputTag: '',
        tagsLimit: 3,
        inputTagVisible: true,


        //quesiton title
        inputTitle: '',
        question: {
          // title: '',
          // content: '',
          // questionerID: '',
          // questionerName: '',
          // questionerAvatar: '',
          // questionerType: '',
          // tags: [],
          // replys: []
        },

      //editor start
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
      }
    },
    methods: {
      checkLoginStatus() {
        !this.isLogin && this.loginToast();
      },
      handleInputConfirm() {
        let inputTag = this.inputTag;
        const noRepeat = !this.tags.some( v => v === inputTag );
        if(!noRepeat) {
          this.$toast.failed('不能输入重复标签！')
        }
        if (inputTag && noRepeat) {
          this.tags.push(inputTag);
          if(this.tags.length >= this.tagsLimit) {
            this.inputTagVisible = false;
          }
        }
        this.inputTag = '';
      },
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        if(this.tags.length < this.tagsLimit) {
          setTimeout( () => this.inputTagVisible = true, 500);
        }
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
        this.$dialog.confirm({
          title: '确认',
          content: '请确认是否提交问题',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm: () => {
            const Q = this.question;
            Q.questionerID = this.user.id;
            Q.questionerName = this.user.username;
            Q.questionerAvatar = this.user.avatar;
            Q.questionerType = this.user.userType === 1 ? 'teacher' : 'student';
            Q.tags = this.tags; 
            this.$http.post(`uploadQaQuestion`, Q)
              .then(res => {
                if (res.data.code === 1) {
                  this.$toast.succeed('提交成功！');
                  this.$router.push({
                    path: '/qa'
                  });
                } else {
                  console.error(res.data)
                  this.$toast.failed(res.data);
                }
              })
              .catch(err => {
                this.$toast.failed(err);
                console.log(err);
              });   
          }
        })
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
        this.$toast.failed(`${message}不能为空！`);
      },
    },
    components: {
      Tag
    },
  }
</script>

<style lang="scss" scoped>
.add-tags {
  margin-top: 1rem;
}
.aq-wrapper {
  margin: 1.5rem;
}
.input-title {
    display: block;
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
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
.input-title:focus, .input-tag:focus {
  color: #495057;
  background-color: #fff;
  border-color: #62acf5;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(3, 169, 244, 0.25)
}
.base-tag {
  margin-right: .5rem;
}
.input-tag {
  width: 4rem;
    font-size: 0.75rem;
    height: 2rem;
    border-radius: .4rem;
    padding: .2rem;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid #d9ecff;
    background-color: #f8f9fa;
    display: inline-block;
    color: #212529;
    line-height: 1.5;
    margin-left: 0;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
</style>

<style lang="scss">
.question-ckeditor {
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