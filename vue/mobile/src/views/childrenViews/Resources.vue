<template>
  <div class="gray-bg">
    <div class="search-panel" v-show="searchPanelShow">
      <div class="search-input">
        <md-icon class="search" name="search"></md-icon>
        <input
          type="text"
          autofocus
          placeholder="搜索资源名称"
          @change="event => {this.searchValue = event.target.value}"
        >
        <md-button class="btn-cancel" type="link" @click="searchPanelShow = false">取消</md-button>
      </div>
      <md-button
        type="primary"
        class="btn-search"
        icon="search"
        @click="!(searchPanelShow = false) && (search = searchValue)"
      >搜索</md-button>
    </div>

    <Card round>
      <div class="header">
        <span class="title">资源下载</span>
        <div class="tool-bar">
          <md-button class="filter-btn" type="link" @click="searchPanelShow = true">搜索</md-button>
          <md-button class="filter-btn" type="link" @click="isFilterSelectorShow = true">筛选</md-button>
        </div>
      </div>

      <div class="no-resources" v-if="resources.length === 0">
        <span>暂无数据</span>
      </div>

      <md-cell-item
        v-for="resource in resources"
        :key="resource.filename"
        :title="resource.filename"
        arrow
        :brief="resource.date"
        :addon="/\.pdf$/i.test(resource.filename) ? '可预览' : ''"
        @click="(isOperateSelectorShow = true) && (currentFile = resource)"
      />

      <div class="show-more">
        <span v-if="!gotAllResources" @click="showMore">显示更多</span>
      </div>
    </Card>

    <md-selector
      v-model="isFilterSelectorShow"
      :data="classifyOptions[0]"
      max-height="320px"
      title="筛选分类"
      @choose="({value}) => { this.classify = value }"
    ></md-selector>

    <md-selector
      v-model="isOperateSelectorShow"
      :data="/\.pdf$/i.test(currentFile.filename) ? [{ value: 'preview', text: '在线预览' }, { value: 'download', text: '下载' }] : [{ value: 'download', text: '下载' }]"
      max-height="320px"
      title="操作"
      @choose="resourceOperate"
    ></md-selector>
    <!-- 
      <el-col :span="5">
        <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="search" size="small"></el-input>
      </el-col>
    </el-row>-->
    <!-- <el-row class="resources-list">
      <el-table :data="resources" v-loading="loading" style="width: 100%">
        <el-table-column v-if="user.userType === 1" prop="filename">
    <template slot="header" slot-scope="scope">-->
    <!-- slot-scope="scope"不能去掉，去掉了就不会显示这个模板 -->
    <!-- <el-button type="primary" size="small" @click="updateResource">
              <i class="el-icon-upload el-icon--left"></i>上传资源
            </el-button>
          </template>
          <template slot-scope="scope">
            <a
              :href="scope.row.href"
              class="download-link"
              :download="scope.row.filename"
            >{{scope.row.filename}}</a>
            <el-button
              v-if="/\.pdf$/i.test(scope.row.filename)"
              type="text"
              style="margin-left: 10px;"
              size="small"
              @click="$router.push({ path: `/library/${encodeFilename(scope.row.filename)}` })"
            >在线预览</el-button>
          </template>
        </el-table-column>

        <el-table-column v-else prop="filename" label="下载">
          <template slot-scope="scope">
            <a
              :href="scope.row.href"
              class="download-link"
              :download="scope.row.filename"
            >{{scope.row.filename}}</a>
            <el-button
              v-if="/\.pdf$/i.test(scope.row.filename)"
              type="text"
              style="margin-left: 10px;"
              size="small"
              @click="$router.push({ path: `/library/${encodeFilename(scope.row.filename)}` })"
            >在线预览</el-button>
          </template>
    </el-table-column>-->

    <!-- <el-table-column prop="date" label="日期" align="right" width="180"></el-table-column>

        <el-table-column v-if="user.userType === 1" label="操作" align="right" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delResource(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>-->
    <!-- <el-dialog v-if="user.userType === 1" title="上传资源" :visible.sync="updateDialogVisible">
      <el-row type="flex" justify="center" style="margin-bottom: 20px;">
        <span style="line-height: 32px;">上传到类别：</span>
        <el-select v-model="updateClassify" size="small" placeholder="请选择类别">
          <el-option
            v-for="item in updateClassifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
    -->
    <!-- <el-row type="flex" justify="center">
        <el-upload
          drag
          multiple
          ref="upload"
          :action="$serverBaseUrl + '/api/updateResources'"
          :data="{ classify: updateClassify }"
          :with-credentials="true"
          :on-remove="handleRemove"
          :on-error="handleError"
          :on-success="handleSuccess"
          :file-list="fileList"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">{{uploadTip}}</div>
        </el-upload>
      </el-row>
    -->
    <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updating" @click="submitUpload">开始上传</el-button>
      </div>

      <el-dialog
        width="30%"
        title="上传成功"
        :visible.sync="updateSuccessDialogVisible"
        :before-close="beforeSuccessDialogClose"
        append-to-body
      >
        <span>{{updated}}个文件已成功上传</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="continueUpdate">继续上传</el-button>
          <el-button type="primary" @click="$router.push({ path: '/emptyPage' })">返回资源列表</el-button>
        </div>
      </el-dialog>
    </el-dialog>-->
  </div>
</template>

<script>
import Card from '../../components/Card';

export default {
  data() {
    return {
      currentFile: {},
      searchPanelShow: false,
      isOperateSelectorShow: false,
      isFilterSelectorShow: false,
      classifyOptions: [
        [
          {
            value: 'all',
            text: '全部结果'
          },
          {
            value: 'courseware',
            text: '课件'
          },
          {
            value: 'software',
            text: '软件'
          }
        ]
      ],
      classify: 'all',

      searchValue: '',
      search: '',

      loading: true,
      allResources: [],
      skip: 0,
      limit: 15,
      gotAllResources: false,

      updateDialogVisible: false,
      updateClassifyOptions: [
        {
          value: 'courseware',
          label: '课件'
        },
        {
          value: 'software',
          label: '软件'
        }
      ],
      updateClassify: 'courseware',
      fileList: [],
      updating: false,
      updated: 0,

      updateSuccessDialogVisible: false
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
      if (this.classify === 'software') {
        return '请打包成单个文件后再上传';
      }
    }
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  watch: {
    classify: function(newValue, oldValue) {
      this.skip = 0;
      this.allResources = [];
      this.gotAllResources = false;
      this.getResources(newValue);
    }
  },
  created() {
    this.getResources('all');
  },
  methods: {
    resourceOperate({ value }) {
      if (value === 'preview') {
        this.$router.push({
          path: `/library/${this.encodeFilename(this.currentFile.filename)}`
        });
      } else if (value === 'download') {
        const a = document.createElement('a');
        a.href = this.currentFile.href;
        a.download = this.currentFile.filename;
        a.click();
      }
    },
    encodeFilename(filename) {
      return filename
        .replace('+', '%2B')
        .replace(' ', '-')
        .replace('/', '%2F')
        .replace('?', '%3F')
        .replace('#', '%23')
        .replace('&', '%26')
        .replace('=', '%3D');
    },

    decodeFilename(filename) {
      return filename
        .replace('%2B', '+')
        .replace('%2F', '/')
        .replace('%3F', '?')
        .replace('%23', '#')
        .replace('%26', '&')
        .replace('%3D', '=');
    },
    showMore() {
      this.skip += this.limit;
      this.getResources(this.classify);
    },
    getResources(classify) {
      this.loading = true;
      this.$http
        .post('/api/getResources', {
          classify,
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
                href: `${this.$serverBaseUrl}/static/${data.classify}/${
                  data.filename
                }`
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
          this.$http
            .post('/api/delResources', {
              classify: resource.classify,
              filename: resource.filename
            })
            .then(res => {
              if (res.data.code === 1) {
                that.$alert(`${resource.filename}已删除`, '删除成功', {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.$router.push({ path: '/emptyPage' });
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
    updateResource() {
      this.updateDialogVisible = true;
    },
    clearFileList() {
      this.updated = 0;
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
        this.updated++;
        if (this.updated >= fileList.length) {
          // 全部上传成功
          this.updating = false;
          this.updateSuccessDialogVisible = true;
        }
      }
      if (response.code === 0) {
        this.updating = false;
        this.clearFileList();
        this.$alert(response.info, '上传失败', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({ path: '/emptyPage' });
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
    continueUpdate() {
      this.clearFileList();
      this.updateSuccessDialogVisible = false;
    },
    beforeSuccessDialogClose(done) {
      this.clearFileList();
      done();
    },
    dateFormat(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.gray-bg {
  background-color: rgb(240, 240, 240);
}

.search-panel {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  padding: 1rem;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 9999;

  .search-input {
    position: relative;
    margin-bottom: 2rem;

    .search {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      width: 1.8rem;
      height: 1.8rem;
    }

    input {
      box-sizing: border-box;
      padding: 0.5rem 0.5rem 0.5rem 2.55rem;
      width: calc(100% - 3rem);
      height: 2.5rem;
      font-size: 0.9rem;
      outline: none;
      border: none;
      border-radius: 10px;
      background-color: #ededed;
    }

    .btn-cancel {
      width: 3rem;
      height: 2.5rem;
      font-size: 1rem;
    }
  }

  .btn-search {
    margin: 0 auto;
    width: 75%;
    height: 2.4rem;
  }
}

.header {
  display: table;
  width: 100%;

  .title {
    display: table-cell;
  }

  .tool-bar {
    display: table-cell;
    text-align: right;
  }
}

.no-resources {
  margin: 5rem 0;
  text-align: center;
  color: #606266;
}

.show-more {
  padding: 1rem 0 0;
  text-align: center;
  color: #409eff;
}
</style>
