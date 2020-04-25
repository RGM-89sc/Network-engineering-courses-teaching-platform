<template>
  <div>
    <div class="login-logo"></div>
    <md-field>
      <md-input-item
        type="text"
        title="学号/工号："
        v-model="loginData.id"
        placeholder="请输入学号/工号"
        autocomplete="off"
        clearable
        @change="checkID"
      >
        <p v-if="isIDError" slot="error">请输入学号/工号！</p>
      </md-input-item>
      <md-input-item
        type="password"
        title="密码："
        v-model="loginData.password"
        placeholder="请输入密码"
        autocomplete="off"
        clearable
        @change="checkPW"
      >
        <p v-if="isPWError" slot="error">请输入密码！</p>
      </md-input-item>
      <md-field-item
        title="我是："
        :content="loginData.userType === 0 ? '学生' : (loginData.userType === 1 ? '教师' : '')"
        placeholder="请选择"
        @click="isSelectorShow = true"
        arrow
        solid
      />
      <div class="login">
        <md-button
          type="primary"
          :icon="submiting ? 'spinner' : ''"
          round
          @click="submitForm"
        >{{submiting ? '登 录 中' : '登 录'}}</md-button>
      </div>
      <div class="register">
        <span @click="$emit('changeTab', 'Register')">还没有账号？马上注册</span>
      </div>
    </md-field>
    <md-selector
      v-model="isSelectorShow"
      :data="[{value: '0', text: '学生'}, {value: '1', text: '教师'}]"
      max-height="320px"
      title="我是"
      @choose="({ value, text }) => { this.loginData.userType = parseInt(value); }"
    ></md-selector>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      userType: 0,
      loginData: {
        id: '',
        password: '',
        userType: ''
      },
      isSelectorShow: false,
      isIDOK: false,
      isIDError: false,
      isPWOK: false,
      isPWError: false,

      submiting: false
    };
  },
  props: {
    title: {
      type: String
    }
  },
  methods: {
    checkPW(name, value) {
      if (value === '') {
        this.isPWOK = false;
        this.isPWError = true;
      } else {
        this.isPWOK = true;
        this.isPWError = false;
      }
    },
    checkID(name, value) {
      if (value === '') {
        this.isIDOK = false;
        this.isIDError = true;
      } else {
        this.isIDOK = true;
        this.isIDError = false;
      }
    },
    submitForm() {
      if (!this.isIDOK || !this.isPWOK) {
        this.checkID(null, this.loginData.id);
        this.checkPW(null, this.loginData.password);
        return false;
      }
      if (this.loginData.userType !== 0 && this.loginData.userType !== 1) {
        this.$toast.failed('请选择您的身份');
        return false;
      }
      this.submiting = true;

      let url;

      if (this.loginData.userType === 0) {
        url = 'stuLogin';
      } else {
        url = 'tchLogin';
      }

      this.$http
        .post(url, {
          id: this.loginData.id,
          password: this.loginData.password,
          userType: this.loginData.userType
        })
        .then(res => {
          if (res.data.code === 1) {
            this.$emit('login', this.$getLoginState());
            this.$router.push({ path: '/' });
          }
          if (res.data.code === 0) {
            this.$toast.failed(res.data.info);
          }
          if (res.data.code === -1) {
            this.$toast.failed(res.data.errMsg);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.submiting = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-button {
  height: 2.9rem;
  line-height: 2.9rem;
}

.login-logo {
  margin-bottom: 1rem;
  height: 5rem;
  background: url('../../assets/logo.png') no-repeat center;
  background-size: 5rem 5rem;
}

.login {
  padding: 3rem 1.2rem;
}

.register {
  text-align: center;

  span {
    display: inline-block;
    margin-bottom: 20px;
    color: #409eff;
    cursor: pointer;
    border-bottom: 1px solid #409eff;
  }
}
</style>
