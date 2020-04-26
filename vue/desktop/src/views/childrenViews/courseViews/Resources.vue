<template>
  <div>
    <el-row type="flex" justify="space-between">
      <!-- <el-col :span="5">
        <el-select v-model="classify" placeholder="全部结果" size="small">
          <el-option
            v-for="item in classifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col> -->
      <el-col :span="5">
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="search"
          size="small"
        ></el-input>
      </el-col>
    </el-row>
    <el-row class="resources-list" type="flex">
      <el-table :data="resources" v-loading="loading" style="width: 100%">
        <el-table-column v-if="user.userType === 1" prop="filename">
          <template slot="header" slot-scope="scope">
            <!-- slot-scope="scope"不能去掉，去掉了就不会显示这个模板 -->
            <el-button type="primary" size="small" @click="uploadResource">
              <i class="el-icon-upload el-icon--left"></i>上传课件
            </el-button>
          </template>
          <template slot-scope="scope">
            <a
              :href="scope.row.href"
              class="download-link"
              :download="scope.row.filename"
            >{{ scope.row.filename }}</a>
            <el-button
              v-if="/\.pdf$/i.test(scope.row.filename)"
              type="text"
              style="margin-left: 10px;"
              size="small"
              @click="
                $router.push({
                  name: 'preview_courseware',
                  params: {
                    course_id: $route.params.course_id,
                    filename: scope.row.filename
                  }
                })
              "
            >在线预览</el-button>
          </template>
        </el-table-column>

        <el-table-column v-else prop="filename" label="下载">
          <template slot-scope="scope">
            <a
              :href="scope.row.href"
              class="download-link"
              :download="scope.row.filename"
            >{{ scope.row.filename }}</a>
            <el-button
              v-if="/\.pdf$/i.test(scope.row.filename)"
              type="text"
              style="margin-left: 10px;"
              size="small"
              @click="
                $router.push({
                  name: 'preview_courseware',
                  params: {
                    course_id: $route.params.course_id,
                    filename: scope.row.filename
                  }
                })
              "
            >在线预览</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="日期"
          align="right"
          width="180"
        ></el-table-column>

        <el-table-column
          v-if="user.userType === 1"
          label="操作"
          align="right"
          width="100">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="delResource(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <span class="show-more" v-if="!gotAllResources" @click="showMore">显示更多</span>
    </el-row>

    <el-dialog
      v-if="user.userType === 1"
      title="上传课件"
      :visible.sync="uploadDialogVisible">
      <!-- <el-row type="flex" justify="center" style="margin-bottom: 20px;">
        <span style="line-height: 32px;">上传到类别：</span>
        <el-select
          v-model="uploadClassify"
          size="small"
          placeholder="请选择类别"
        >
          <el-option
            v-for="item in uploadClassifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row> -->

      <el-row type="flex" justify="center">
        <el-upload
          drag
          multiple
          ref="upload"
          :action="$serverBaseUrl + '/api/uploadResources'"
          :data="{classify: uploadClassify, courseID}"
          :with-credentials="true"
          :on-remove="handleRemove"
          :on-error="handleError"
          :on-success="handleSuccess"
          :file-list="fileList"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">{{ uploadTip }}</div>
        </el-upload>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updating" @click="submitUpload">开始上传</el-button>
      </div>

      <el-dialog
        width="30%"
        title="上传成功"
        :visible.sync="uploadSuccessDialogVisible"
        :before-close="beforeSuccessDialogClose"
        append-to-body>
        <span>{{ uploaded }}个文件已成功上传</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="continueUpload">继续上传</el-button>
          <el-button
            type="primary"
            @click="$router.push({ path: '/emptyPage' })"
            >返回资源列表</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {ResourcesProvider} from '@/provider/index';
export default {
  name: 'show_resources',
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    courseID: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // classifyOptions: [
      //   {
      //     value: 'all',
      //     label: '全部结果'
      //   },
      //   {
      //     value: 'courseware',
      //     label: '课件'
      //   },
      //   {
      //     value: 'software',
      //     label: '软件'
      //   }
      // ],
      classify: 'courseware',

      search: '',

      loading: true,
      allResources: [],
      skip: 0,
      limit: 15,
      gotAllResources: false,

      uploadDialogVisible: false,
      // uploadClassifyOptions: [
      //   {
      //     value: 'courseware',
      //     label: '课件'
      //   },
      //   {
      //     value: 'software',
      //     label: '软件'
      //   }
      // ],
      uploadClassify: 'courseware',
      fileList: [],
      updating: false,
      uploaded: 0,

      uploadSuccessDialogVisible: false,
    };
  },
  computed: {
    resources() {
      return this.allResources.filter(resource => {
        return new RegExp(this.search, 'i').test(resource.filename);
      });
    },
    uploadTip() {
      if (this.classify === 'courseware') {
        return '请选择.pdf文件进行上传，.ppt/.pptx无法在线预览';
      }
      // if (this.classify === 'software') {
      //   return '请打包成单个文件后再上传';
      // }
    }
  },

  // watch: {
  //   classify: function(newValue, oldValue) {
  //     this.skip = 0;
  //     this.allResources = [];
  //     this.gotAllResources = false;
  //     this.getResources(newValue);
  //   }
  // },
  created() {
    this.getResources(this.classify);
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
    showMore() {
      this.skip += this.limit;
      this.getResources(this.classify);
    },
    getResources(classify) {
      this.loading = true;
      ResourcesProvider.getResources({
        classify,
        courseID:  this.courseID,
        skip: this.skip,
        limit: this.limit
      })
        .then(res => {
          if (res.data.code === 1) {
            const resources = res.data.data.map(data => {
              return {
                filename: this.decodeFilename(data.filename),
                date: this.dateFormat(data.created),
                classify: data.classify,
                href: `${this.$serverBaseUrl}/static/${data.classify}/${this.courseID}/${data.filename}`
              };
            });
            this.allResources.push(...resources);
            if (resources.length < this.limit) {
              this.gotAllResources = true;
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    delResource(resource) {
      const that = this;
      this.$confirm('此操作将从服务器删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确定 
          ResourcesProvider.delResources({
            classify: resource.classify,
            filename: resource.filename,
            courseID: that.courseID
          })
            .then(res => {
             
              if (res.data.code === 1) {
                that.$alert(`${resource.filename}已删除`, '删除成功', {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.$router.push({path: '/emptyPage'});
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消
        });
    },
    uploadResource() {
      this.uploadDialogVisible = true;
    },
    clearFileList() {
      this.uploaded = 0;
      this.fileList = [];
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.updating = true;
    },
    handleRemove(file, fileList) {},
    handleError(err, file, fileList) {},
    handleSuccess(response, file, fileList) {
      if (response.code === 1) {
        this.uploaded++;
        if (this.uploaded >= fileList.length) {
          // 全部上传成功
          this.updating = false;
          this.uploadSuccessDialogVisible = true;
        }
      }
      if (response.code === 0) {
        this.updating = false;
        this.clearFileList();
        this.$alert(response.info, '上传失败', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/emptyPage'});
          }
        });
      }
      if (response.code === -1) {
        this.updating = false;
        this.clearFileList();
        this.$alert('发生了错误导致上传失败', '上传失败', {
          confirmButtonText: '确定'
        });
        console.log(response.errMsg);
      }
    },
    continueUpload() {
      this.clearFileList();
      this.uploadSuccessDialogVisible = false;
    },
    beforeSuccessDialogClose(done) {
      this.clearFileList();
      done();
    },
    dateFormat(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.download-link {
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.show-more {
  display: inline-block;
  margin: 20px auto;
  color: #409eff;
  cursor: pointer;
}
</style>
