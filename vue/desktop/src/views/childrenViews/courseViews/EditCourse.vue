<template>
  <div>
    <el-row type="flex" :gutter="20">
      <el-col :span="17">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ this.partInfo.title }}</span>
          </div>
          <ckeditor
            :editor="editor"
            v-model="editorData"
            :config="editorConfig"
          ></ckeditor>
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card style="margin-bottom: 20px;">
          <el-form
            label-position="top"
            label-width="80px"
            :model="partInfo"
            status-icon
            :rules="partInfoRules"
          >
            <el-form-item class="form-item" label="标题：" prop="title">
              <el-input
                v-model="partInfo.title"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <el-button type="primary" style="width: 100%;" @click="updatePart"
              >发布/更新</el-button
            >
          </el-form>
        </el-card>

        <el-card>
          <el-upload
            accept=".mp4"
            :action="$serverBaseUrl + '/api/uploadCourseVideoChunks'"
            :data="{
              courseID: $route.query.id,
              chapter: $route.query.c,
              part: $route.query.p
            }"
            ref="upload"
            :http-request="uploadVideo"
            :with-credentials="true"
            :file-list="videoes"
            :on-remove="delVideo"
            :on-preview="checkVideoUrl"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <div slot="tip" class="el-upload__tip">
              <p>请注意：</p>
              <p>1、如需插入视频，请先在此上传所需视频再使用视频地址插入</p>
              <p>2、只能上传mp4文件</p>
            </div>
          </el-upload>
        </el-card>

        <el-dialog
          title="上传成功"
          :visible.sync="uploadVideoScuessDialogVis"
          width="30%"
          :before-close="() => false"
          :show-close="false"
        >
          <p>视频上传成功！视频地址：</p>
          <el-input
            v-model="uploadVideoScuessUrl[uploadVideoScuessName]"
            id="uploaded-video-url"
          ></el-input>
          <p>您也可以点击该视频查看视频地址</p>
          <span slot="footer">
            <el-button plain @click="uploadVideoScuessDialogVis = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="copyUploadVideoScuessUrl"
              >复制地址</el-button
            >
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {CoursesProvider} from '@/provider/index';

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
// import MediaEmbedPlugin from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import MediaEmbedPlugin from '../../../../public/ckeditor5-media-embed/src/mediaembed';

import uuidV1 from 'uuid/v1';

export default {
  data() {
    return {
      courseID: '',
      chapter: 0,
      part: 0,
      tchID: '',

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
          ImageStyle,
          MediaEmbedPlugin
        ],

        toolbar: {
          items: [
            'heading',
            '|',
            'link',
            'imageUpload',
            // 'imageStyle:full',
            // 'imageStyle:side',
            'mediaEmbed',
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
          uploadUrl: `${this.$serverBaseUrl}/api/uploadCourseImg?courseID=${this.$route.query.id}&chapter=${this.$route.query.c}&part=${this.$route.query.p}`,
          options: {
            resourceType: '.jpg,.jpeg,.png'
          }
        }
      },

      partInfo: {
        title: ''
      },
      partInfoRules: {
        title: [{required: true, message: '请输入标题', trigger: 'blur'}]
      },

      videoes: [],
      uploadVideoScuessDialogVis: false,
      uploadVideoScuessUrl: {},
      uploadVideoScuessName: ''
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.chapter = parseInt(this.$route.query.c);
    this.part = parseInt(this.$route.query.p);
    this.courseID = this.$route.query.id;
    this.tchID = this.user.id;
    this.getPartDetail();
  },
  methods: {
    encodeFilename(filename) {
      return filename
        .replace(/\+/g, '%2B')
        .replace(/ /g, '-')
        .replace(/\//g, '%2F')
        .replace(/\?/g, '%3F')
        .replace(/#/g, '%23')
        .replace(/&/g, '%26')
        .replace(/=/g, '%3D');
    },

    decodeFilename(filename) {
      return filename
        .replace(/%2B/g, '+')
        .replace(/%2F/g, '/')
        .replace(/%3F/g, '?')
        .replace(/%23/g, '#')
        .replace(/%26/g, '&')
        .replace(/%3D/g, '=');
    },
    getPartDetail() {
      CoursesProvider.getPartDetail({
        courseID: this.courseID,
        chapter: this.chapter,
        part: this.part
      })
        .then(res => {
          if (res.data.code === 1) {
            this.partInfo.title = res.data.data.title;
            this.editorData = res.data.data.content || '';
            this.videoes = res.data.data.videoes;
            this.videoes.forEach(video => {
              this.uploadVideoScuessUrl[video.name] = video.url;
            });
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$confirm('加载失败, 是否重新加载?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.push({path: '/emptyPage'});
              })
              .catch(() => {});
          }
        })
        .catch(err => {
          console.log(err);
          this.$confirm('加载失败, 是否重新加载?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$router.push({path: '/emptyPage'});
            })
            .catch(() => {});
        });
    },
    updatePart() {
      if (!this.partInfo.title) {
        return null;
      }
      this.$confirm('此操作将发布/更新该单元内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CoursesProvider.updatePart({
            courseID: this.courseID,
            chapter: this.chapter,
            part: this.part,
            title: this.partInfo.title,
            content: this.editorData,
            tchID: this.tchID
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({path: `/course/${this.courseID}`});
              }
              if (res.data.code === 0) {
                this.$message({
                  message: res.data.info,
                  type: 'warning'
                });
              }
              if (res.data.code === -1) {
                this.$alert('发生了错误导致该操作执行失败', '发生错误', {
                  confirmButtonText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    checkVideoUrl(file) {
      this.uploadVideoScuessName = this.encodeFilename(file.name);
      this.uploadVideoScuessDialogVis = true;
    },
    delVideo(file, fileList) {
      // 只要用户点击了删除，进入了这个文件，文件都会消失，但数据还在，所以下面这两行代码是为了更新一下响应，躲过这个“bug”
      this.videoes.push({});
      this.videoes.pop();

      this.$confirm('此操作将删除该视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          CoursesProvider.delCourseVideo({
            filename: file.name,
            courseID: this.courseID,
            chapter: this.chapter,
            part: this.part,
            tchID: this.tchID
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.videoes = this.videoes.filter(video => {
                  if (video.name === file.name) {
                    return false;
                  }
                  return true;
                });
              }
              if (res.data.code === -1) {
                this.$alert('发生了错误导致视频删除失败', '删除失败', {
                  confirmButtonText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {});
    },
    copyUploadVideoScuessUrl() {
      const input = document.getElementById('uploaded-video-url');
      input.select();
      this.uploadVideoScuessDialogVis = false;
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message({
          type: 'success',
          message: '视频地址已复制!'
        });
      } else {
        this.$message({
          type: 'warn',
          message: '视频地址复制失败!'
        });
      }
    },
    handleUpload(res) {
      if (res.data.code === 1) {
        this.uploadVideoScuessUrl[this.encodeFilename(res.data.data.filename)] =
          res.data.data.url;
        this.uploadVideoScuessName = this.encodeFilename(
          res.data.data.filename
        );
        this.uploadVideoScuessDialogVis = true;
      }
      if (res.data.code === -1) {
        this.$alert('发生了错误导致视频上传失败', '上传失败', {
          confirmButtonText: '确定'
        });
      }
    },
    handleUploadError(err) {
      this.$alert('发生了错误导致视频上传失败', '上传失败', {
        confirmButtonText: '确定'
      });
      console.log(err);
    },
    uploadVideo(fileObj) {
      const file = fileObj.file;
      const eachSize = 50 * 1024 * 1024; // 每个chunks的大小
      const blockCount = Math.ceil(file.size / eachSize); // 分片总数
      const axiosArray = []; // axiosPromise数组
      const ext = file.name.split('.').slice(-1)[0]; // 获取文件后缀名
      const hash = uuidV1(); // 通过hash标识文件
      const chunksLoads = [];

      // 处理每个分片的上传操作
      for (let i = 0; i < blockCount; i++) {
        let start = i * eachSize,
          end = Math.min(file.size, start + eachSize);

        const form = new FormData();
        form.append('file', file.slice(start, end));
        form.append('index', i);
        form.append('hash', hash);

        // 加入到 Promise 数组中
        axiosArray.push(
          this.$http.request({
            url: 'api/uploadCourseVideoChunks',
            method: 'post',
            data: form,
            onUploadProgress: progressEvent => {
              chunksLoads[i] = progressEvent.loaded;
              const allChunksLoads = chunksLoads.reduce((prev, cur) => {
                return prev + cur;
              });
              const complete = ((allChunksLoads / file.size) * 100) | 0;
              fileObj.onProgress({percent: complete === 100 ? 99 : complete}); // 后台需要拼接文件，所以上传完100%了服务器还是没有返回值，所以直接显示99
            }
          })
        );
      }

      // 所有分片上传后，请求合并分片文件
      return this.$http.all(axiosArray).then(() => {
        // 合并chunks
        const data = {
          name: file.name,
          total: blockCount,
          ext,
          hash,
          courseID: this.courseID,
          chapter: this.chapter,
          part: this.part
        };
        // 请求分片合并
        CoursesProvider.mergeCourseVideoChunks(data).then(
          this.handleUpload,
          this.handleUploadError
        );
      });
    }
  }
};
</script>

<style lang="scss">
.ck-editor__editable {
  margin-bottom: 50px;
  min-height: 70vh;
}
</style>
