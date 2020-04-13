<template>
  <div class="resources-wrapper gray-bg">
    <div class="search-panel" v-show="searchPanelShow">
      <div class="search-input">
        <md-icon class="search" name ="search"></md-icon>
        <input
          type="text"
          autofocus
          placeholder="搜索资源名称"
          @change="event => {this.searchValue = event.target.value}"
          @keyup.enter="searchResources"
        >
        <md-button class="btn-cancel" type="link" @click="searchPanelShow = false">取消</md-button>
      </div>
      <!-- <md-button
        type="primary"
        class="btn-search"
        icon="search"
        @click="!(searchPanelShow = false) && (search = searchValue)"
      >搜索</md-button> -->
    </div>

    <Card round>
      <div class="header">
        <span class="title">资源下载</span>
        <div class="tool-bar">
          <md-button
            v-if="user && user.userType === 1"
            class="search-btn1"
            type="link"
            @click="e => {  this.uploadResource(); }"
          >上传</md-button>
          <md-button class="search-btn" type="link" @click="searchPanelShow = true">搜索</md-button>
          <!-- <md-button class="filter-btn" type="link" @click="isFilterSelectorShow = true">筛选</md-button> -->
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

    <!-- <md-selector
      v-model="isFilterSelectorShow"
      :data="classifyOptions[0]"
      max-height="320px"
      title="筛选分类"
      @choose="({value}) => { this.classify = value }"
    ></md-selector> -->

    <md-selector
      v-model="isOperateSelectorShow"
      :data="fileOperate"
      max-height="320px"
      title="操作"
      @choose="resourceOperate"
    ></md-selector>

    <!-- <md-selector
      v-model="isUploadClassifySelectorShow"
      :data="uploadClassifyOptions[0]"
      max-height="320px"
      title="上传至分类"
      @choose="({value}) => { this.uploadClassify = value; this.uploadResource() }"
    ></md-selector> -->
  </div>
</template>

<script>
import Card from '@/components/Card';

export default {
  data() {
    return {
      currentFile: {},
      searchPanelShow: false,
      isOperateSelectorShow: false,
      // isFilterSelectorShow: false,
      // isUploadClassifySelectorShow: false,
      // classifyOptions: [
      //   [
      //     {
      //       value: 'all',
      //       text: '全部结果'
      //     },
      //     {
      //       value: 'courseware',
      //       text: '课件'
      //     },
      //     {
      //       value: 'software',
      //       text: '软件'
      //     }
      //   ]
      // ],
      classify: 'courseware',

      searchValue: '',
      search: '',

      loading: true,
      allResources: [],
      skip: 0,
      limit: 15,
      gotAllResources: false,

      // uploadClassifyOptions: [
      //   [
      //     {
      //       value: 'courseware',
      //       text: '课件'
      //     },
      //     {
      //       value: 'software',
      //       text: '软件'
      //     }
      //   ]
      // ],
      uploadClassify: 'courseware',
      uploading: false,
      updated: 0
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
    },
    fileOperate() {
      let operateArr;
      if (/\.pdf$/i.test(this.currentFile.filename)) {
        operateArr = [
          { value: 'preview', text: '在线预览' },
          { value: 'download', text: '下载' }
        ];
      } else {
        operateArr = [{ value: 'download', text: '下载' }];
      }
      if (this.user.userType === 1) {
        operateArr.push({ value: 'delete', text: '删除' });
      }
      return operateArr;
    }
  },
  props: {
    user: {
      type: Object,
      default: {}
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
    this.courseID = this.$route.params.course_id;
    this.getResources(this.classify);
  },
  methods: {
    searchResources () {
      this.search = this.searchValue
      this.searchPanelShow = false
    },
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
      } else if (value === 'delete') {
        this.delResource(this.currentFile);
      }
    },
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
      const courseID = this.courseID;
      console.log(classify);
      this.$http
        .post('/api/getResources', {
          classify,
          courseID,
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
                href: `${this.$serverBaseUrl}/static/${data.classify}/${courseID}/${
                  data.filename
                }`
              };
            });
            console.log(resources);
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
      console.log(resource);
      const that = this;
      this.$dialog.confirm({
        title: '提示',
        content: '此操作将从服务器删除该文件, 是否继续?',
        confirmText: '确定',
        onConfirm: () => {
          this.$http
            .post('/api/delResources', {
              classify: resource.classify,
              filename: resource.filename
            })
            .then(res => {
              if (res.data.code === 1) {
                that.$dialog.succeed({
                  title: '删除成功',
                  content: `${resource.filename}已删除`,
                  confirmText: '确定',
                  onConfirm: () => {
                    that.$router.push({ path: '/emptyPage' });
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    uploadResource() {
      const input = document.createElement('input');
      input.type = 'file';
      const that = this;
      input.addEventListener('change', event => {
        that.$dialog.confirm({
          title: '提示',
          content: `请确认是否上传文件：${input.files[0].name}`,
          confirmText: '确定',
          onConfirm: () => {
            that.submitUpload(input.files[0]);
          }
        });
      });
      input.click();
    },
    submitUpload(file) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classify', this.uploadClassify);
      formData.append('courseID', this.courseID);
      this.$http
        .post('/api/uploadResources', formData)
        .then(res => {
          if (res.data.code === 1) {
            this.$dialog.succeed({
              title: '上传成功',
              content: `文件：${file.name} 上传成功`,
              confirmText: '确定',
              onConfirm: () => {
                this.$router.push({ path: '/emptyPage' });
              }
            });
          }
          if (res.data.code === 0) {
            this.uploading = false;
            this.$dialog.failed({
              title: '上传失败',
              content: res.data.info,
              confirmText: '确定',
              onConfirm: () => {
                this.$router.push({ path: '/emptyPage' });
              }
            });
          }
          if (res.data.code === -1) {
            this.uploading = false;
            this.$dialog.failed({
              title: '上传失败',
              content: '发生了错误导致上传失败',
              confirmText: '确定',
              onConfirm: () => {}
            });
            console.log(res.data.errMsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
.resources-wrapper {
  padding-top: 1rem;
  min-height: calc(100vh - 11.83333rem);
}
.md-cell-item {
  word-break: break-all;
}

</style>
