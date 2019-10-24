<template>
  <div>
    <el-form
      label-position="top"
      label-width="80px"
      :model="newBulletin"
      :rules="newBulletinRules"
      ref="newBulletinForm"
      v-if="user.userType === 1 && user.id === courseDetail.tchID"
    >
      <el-form-item label="发表新公告" prop="content">
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="newBulletin.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBulletin('newBulletinForm')"
          >发布</el-button
        >
      </el-form-item>
    </el-form>
    <div class="bulletins">
      <el-collapse v-model="activeBulletinNames">
        <el-collapse-item
          v-for="(bulletin, index) in courseDetail.bulletins"
          :key="index"
          :title="$dayjs(bulletin.created).format('YYYY/MM/DD HH:mm:ss')"
          :name="index"
        >
          <p class="bulletin-content">{{ bulletin.content }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
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
      newBulletinRules: {
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      },
      newBulletin: {
        content: ''
      },
      activeBulletinNames: [0],
      courseDetail: {}
    };
  },
  created() {
    this.getCourseDetail();
  },
  methods: {
    getCourseDetail() {
      console.log();
      this.$http
        .post('/api/getCourseDetail', {
          courseID: this.courseID
        })
        .then(res => {
          if (res.data.code === 1) {
            this.courseDetail = res.data.data;
            this.getBulletins();
          } else if (res.data.code === -1) {
            this.$message.error('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleBulletinHidden() {
      this.$refs.newBulletinForm.resetFields();
      this.activeBulletinNames = [0];
    },
    addBulletin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post('/api/addBulletin', {
              courseID: this.courseID,
              content: this.newBulletin.content
            })
            .then(res => {
              if (res.data.code === 1) {
                this.handleBulletinHidden();
                this.$message({
                  message: '公告发布成功',
                  type: 'success'
                });
                this.getBulletins();
              }
              if (res.data.code === -1) {
                console.log(res.data.errMsg);
                this.$message.error('公告发布失败');
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },

    getBulletins() {
      this.$http
        .get(`/api/getBulletins?courseID=${this.courseID}`)
        .then(res => {
          if (res.data.code === 1) {
            const bulletins = res.data.data.sort((bulletin_a, bulletin_b) => {
              if (bulletin_a.created < bulletin_b.created) {
                return 1;
              }
              if (bulletin_a.created > bulletin_b.created) {
                return -1;
              }
              return 0;
            });
            this.$set(this.courseDetail, 'bulletins', bulletins);
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$message.error('公告获取失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.bulletins {
  padding: 1rem 0;

  .bulletin-content {
    white-space: pre;
  }
}
</style>