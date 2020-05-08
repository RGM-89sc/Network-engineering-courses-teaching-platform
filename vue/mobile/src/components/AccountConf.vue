<template>
  <div>
    <Card round class="avatar">
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
        :url="changePWAPIUrl"
      >
        <span class="select-avatar md-button inline small">选择头像</span>
      </vue-core-image-upload>
    </Card>

    <Card round>
      <md-input-item
        title="新密码："
        type="password"
        v-model="changePassword.new"
        placeholder="请输入新密码"
        autocomplete="off"
        @change="checkPW"
      >
        <p v-if="isPWError" slot="error">密码应至少6个字符且不多于16个字符！</p>
      </md-input-item>
      <md-input-item
        title="确认新密码："
        type="password"
        v-model="changePassword.newAgain"
        placeholder="请确认新密码"
        autocomplete="off"
        @change="checkPWAgain"
      >
        <p v-if="isPWAgainError" slot="error">请再次输入密码！</p>
      </md-input-item>
      <div class="change-pw">
        <md-button type="primary" @click="changeNewPassword">更新密码</md-button>
      </div>
    </Card>

    <Card round>
      <md-button type="warning" @click="logout">退出登录</md-button>
    </Card>
  </div>
</template>

<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import Card from './Card';

export default {
  data() {
    return {
      changePassword: {
        new: '',
        newAgain: ''
      },
      isPWError: false,
      isPWOK: false,
      isPWAgainError: false,
      isPWAgainOK: false,
      changePWAPIUrl: '',
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
      this.changePWAPIUrl = this.$serverBaseUrl + '/api/tchChangeAvatar';
    } else if (this.user.userType === 0) {
      this.changePWAPIUrl = this.$serverBaseUrl + '/api/stuChangeAvatar';
    }
    this.avatar = this.user.avatar;
  },
  methods: {
    logout() {
      this.$dialog.confirm({
        title: '退出登录',
        content: '请确认是否退出登录',
        confirmText: '确定',
        onConfirm: () => {
          let url;

          if (this.user.userType === 0) {
            url = 'stuLogout';
          } else {
            url = 'tchLogout';
          }

          this.$http
            .get(url)
            .then(res => {
              if (res.data.code === 1) {
                this.$emit('logout');
                this.$router.push({ path: '/' });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    checkPW(name, value) {
      if (value.length < 6 || value.length > 16) {
        this.isPWOK = false;
        this.isPWError = true;
      } else {
        this.isPWOK = true;
        this.isPWError = false;
      }
    },
    checkPWAgain(name, value) {
      if (value !== this.changePassword.new) {
        this.isPWAgainOK = false;
        this.isPWAgainError = true;
      } else {
        this.isPWAgainOK = true;
        this.isPWAgainError = false;
      }
    },
    changeNewPassword() {
      if (this.isPWOK && this.isPWAgainOK) {
        let apiUrl = '';
        if (this.user.userType === 1) {
          apiUrl = 'tchChangePW';
        } else if (this.user.userType === 0) {
          apiUrl = 'stuChangePW';
        } else {
          return false;
        }
        this.$http
          .post(apiUrl, { password: this.changePassword.new })
          .then(res => {
            if (res.data.code === 1) {
              this.changePassword = {
                new: '',
                newAgain: ''
              };
              this.$toast.succeed('密码已更改，将在下次登录生效');
              this.$nextTick(() => {
                this.isPWError = false;
                this.isPWOK = false;
                this.isPWAgainError = false;
                this.isPWAgainOK = false;
              });
            }
            if (res.data.code === -1) {
              this.$dialog.failed({
                title: '发生错误',
                content: '发生了错误导致更改密码失败',
                confirmText: '确定',
                onConfirm: () => {}
              });
              console.log(res.data.errMsg);
            }
          })
          .catch(err => {
            this.$dialog.failed({
              title: '发生错误',
              content: '发生了错误导致更改密码失败',
              confirmText: '确定',
              onConfirm: () => {}
            });
            console.log(err);
          });
      } else {
        if (!this.isPWOK) {
          this.isPWError = true;
        }
        if (!this.isPWAgainOK) {
          this.isPWAgainError = true;
        }
      }
    },
    imageuploaded(res) {
      if (res.code === 1) {
        //需要和$emit 事件组合使用，通知header更改头像
        //因为header中的头像地址引用的是user.avatar 故直接修改user.avatar应该能达到预期效果
        this.user.avatar = this.avatar = res.data.avatarUrl + `?timestamp=${Date.now()}`; 
        // window.location.reload();
      }
      if (res.code === -1) {
        this.$dialog.failed({
          title: '失败',
          content: '头像更改失败',
          confirmText: '确定',
          onConfirm: () => {}
        });
      }
    }
  },
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
    Card
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  margin-top: 1rem;
  text-align: center;

  .avatar-show {
    margin-bottom: 20px;
    width: 40%;
    border: 1px solid #ddd;
  }

  .select-avatar {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
}

.change-pw {
  padding-top: 30px;
}
</style>
