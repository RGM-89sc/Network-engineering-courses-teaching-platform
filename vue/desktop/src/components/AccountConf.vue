<template>
  <el-row :gutter="20">
    <el-col :span="14" class="left">
      <span class="form-title">更改密码</span>
      <el-divider></el-divider>
      <el-form
        status-icon
        label-position="top"
        label-width="80px"
        :model="changePassword"
        :rules="changePasswordRules"
        ref="changePassword"
      >
        <el-form-item label="新密码：" prop="pass">
          <el-input
            type="password"
            v-model="changePassword.new"
            placeholder="请输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="checkPass">
          <el-input
            type="password"
            v-model="changePassword.newAgain"
            placeholder="请确认新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeNewPassword">更新密码</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="10" class="right">
      <img class="avatar-show" :src="avatar">
      <vue-core-image-upload
        crop="local"
        resize="local"
        @imageuploaded="imageuploaded"
        :cropBtn="{ ok:'确定','cancel':'放弃' }"
        extensions="jpg,jpeg,png"
        inputAccept="image/jpg,image/jpeg,image/png"
        :max-width="300"
        :max-height="300"
        :compress="20"
        inputOfFile="avatar"
        :credentials="true"
        cropRatio="1:1"
        :max-file-size="5242880"
        :url="changeAvatarApiUrl"
      >
        <el-button type="primary">选择头像</el-button>
      </vue-core-image-upload>
    </el-col>
  </el-row>
</template>

<script>
import { UserProvider } from '../provider/index'
import VueCoreImageUpload from 'vue-core-image-upload';

export default {
  components: {
    'vue-core-image-upload': VueCoreImageUpload
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      // 这里的value始终undefined，我鬼知道是怎么回事啊，这个问题贼烦，github issue找到非常相似的，但是并没有解决！
      if (this.changePassword.new === '') {
        callback(new Error('请输入密码'));
      } else if (this.changePassword.new.length < 6 || this.changePassword.new.length > 16) {
        callback(new Error('密码应至少6个字符且不多于16个字符'));
      } else {
        if (this.changePassword.newAgain !== '') {
          this.$refs.changePassword.validateField('checkPass');
        }
        callback();
      }
    };

    const validatePassword2 = (rule, value, callback) => {
      // 这里的value也是undefined！
      if (this.changePassword.newAgain === '') {
        callback(new Error('请再次输入密码'));
      } else if (this.changePassword.newAgain !== this.changePassword.new) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      changePassword: {
        new: '',
        newAgain: ''
      },
      changePasswordRules: {
        pass: [{ validator: validatePassword, trigger: 'change' }],
        checkPass: [{ validator: validatePassword2, trigger: 'change' }]
      },
      changeAvatarApiUrl: '',
      avatar: ''
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    if (this.user.userType === 1) {
      this.changeAvatarApiUrl = this.$apiBaseUrl + 'tchChangeAvatar';
    } else if (this.user.userType === 0) {
      this.changeAvatarApiUrl = this.$apiBaseUrl + 'stuChangeAvatar';
    }
    this.avatar = this.user.avatar;
  },
  methods: {
    changeNewPassword() {
      this.$refs['changePassword'].validate(valid => {
        if (valid) {
          let userType = '';
          if (this.user.userType === 1) {
            userType = 'TCH';
          } else if (this.user.userType === 0) {
            userType = 'STU';
          } else {
            return false;
          }

          UserProvider.user.changePW(userType, { password: this.changePassword.new })
            .then(res => {
              if (res.code === 1) {
                this.changePassword = {
                  new: '',
                  newAgain: ''
                };
                this.$refs['changePassword'].resetFields();
                this.$message({
                  message: '密码已更改，将在下次登录生效',
                  type: 'success'
                });
              }
              if (res.code === -1) {
                this.$alert('发生了错误导致更改密码失败', '发生错误', {
                  confirmButtonText: '确定'
                });
                console.log(res.errMsg);
              }
            })
            .catch(err => {
              this.$alert('发生了错误导致更改密码失败', '发生错误', {
                confirmButtonText: '确定'
              });
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    imageuploaded(res) {
      if (res.code === 1) {
        this.$message({
          message: '头像更换成功！',
          type: 'success'
        });
        //需要和$emit 事件组合使用，通知header更改头像
        //bad solution
        //this.avatar = res.data.avatarUrl + `?timestamp=${Date.now()}`; 
        window.location.reload();
      }
      if (res.code === -1) {
        this.$alert('头像更改失败', '失败', {
          confirmButtonText: '确定'
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.left,
.right {
  padding: 30px 0;
}

.left {
  .form-title {
    font-size: 1.5rem;
  }
}

.right {
  text-align: center;

  .avatar-show {
    margin-bottom: 30px;
    width: 60%;
    border: 1px solid #ddd;
  }
}
</style>
