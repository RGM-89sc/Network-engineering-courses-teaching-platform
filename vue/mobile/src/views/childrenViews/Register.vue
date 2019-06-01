<template>
  <div>
    <md-field>
      <md-input-item
        type="text"
        title="学号/工号："
        v-model="registerData.id"
        placeholder="请输入学号/工号"
        autocomplete="off"
        clearable
        @change="checkID"
      >
        <p v-if="isIDError" slot="error">请输入学号/工号！</p>
      </md-input-item>
      <md-input-item
        type="text"
        title="姓名："
        v-model="registerData.username"
        placeholder="请输入姓名"
        autocomplete="off"
        clearable
        @change="checkUsername"
      >
        <p v-if="isUsernameError" slot="error">请输入姓名！</p>
      </md-input-item>
      <md-input-item
        type="password"
        title="密码："
        v-model="registerData.password"
        placeholder="请输入密码"
        autocomplete="off"
        clearable
        @change="checkPW"
      >
        <p v-if="isPWError" slot="error">密码应至少6个字符且不多于16个字符！</p>
      </md-input-item>
      <md-field-item
        title="我是："
        :content="registerData.userType === 0 ? '学生' : (registerData.userType === 1 ? '教师' : '')"
        placeholder="请选择"
        @click="isUserTypeSelectorShow = true"
        arrow
        solid
      />
      <md-field-item
        title="学院/系："
        arrow="arrow-right"
        :addon="registerData.faculty || '请选择'"
        @click="isFacultyPickerShow = true"
      ></md-field-item>
      <div v-if="registerData.userType === 0">
        <md-field-item
          title="年级："
          arrow="arrow-right"
          :addon="registerData.grade || '请选择'"
          @click="isGradePickerShow = true"
        ></md-field-item>
        <md-field-item
          title="专业："
          arrow="arrow-right"
          :addon="registerData.major || '请选择'"
          @click="isMajorPickerShow = true"
        ></md-field-item>
        <md-field-item
          title="班级："
          arrow="arrow-right"
          :addon="registerData.sclass || '请选择'"
          @click="isSclassPickerShow = true"
        ></md-field-item>
      </div>

      <div class="register">
        <md-button
          type="primary"
          :icon="submiting ? 'spinner' : ''"
          round
          @click="submitForm"
        >{{submiting ? '请 稍 后' : '注册并登录'}}</md-button>
      </div>
      <div class="login">
        <span @click="$emit('changeTab', 'Login')">已有账号？马上登录</span>
      </div>
    </md-field>

    <md-selector
      v-model="isUserTypeSelectorShow"
      :data="[{value: '0', text: '学生'}, {value: '1', text: '教师'}]"
      max-height="320px"
      title="我是"
      @choose="({ value, text }) => { this.registerData.userType = parseInt(value); }"
    ></md-selector>
    <md-picker
      ref="faculty"
      v-model="isFacultyPickerShow"
      :data="facultyData"
      @confirm="onPickerConfirm('faculty')"
      title="学院/系"
    ></md-picker>
    <div v-if="registerData.userType === 0">
      <md-picker
        ref="grade"
        v-model="isGradePickerShow"
        :data="gradeData"
        @confirm="onPickerConfirm('grade')"
        title="年级"
      ></md-picker>
      <md-picker
        ref="major"
        v-model="isMajorPickerShow"
        :data="majorData"
        @confirm="onPickerConfirm('major')"
        title="专业"
      ></md-picker>
      <md-picker
        ref="sclass"
        v-model="isSclassPickerShow"
        :data="sclassData"
        @confirm="onPickerConfirm('sclass')"
        title="班级"
      ></md-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      registerData: {
        id: '',
        username: '',
        password: '',
        userType: '',
        faculty: '',
        major: '',
        grade: '',
        sclass: ''
      },
      gradeData: [[]],
      faculty: {
        ['计算机工程学院']: {
          ['网络工程']: [1, 2]
        }
      },
      facultyData: [],
      majorData: [],
      sclassData: [],

      isUserTypeSelectorShow: false,
      isFacultyPickerShow: false,
      isGradePickerShow: false,
      isMajorPickerShow: false,
      isSclassPickerShow: false,

      isIDError: false,
      isIDOK: false,
      isUsernameError: false,
      isUsernameOK: false,
      isPWError: false,
      isPWOK: false,

      submiting: false
    };
  },
  created() {
    // 初始化学院数组
    let facultyData = [];
    Object.keys(this.faculty).forEach(faculty => {
      facultyData.push({
        value: faculty,
        text: faculty
      });
    });
    this.facultyData.push(facultyData);

    // 初始化年级选择器中的选项
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      let year = '';
      if (date.getMonth() > 8) {
        // 8、9月入学，已入学的学生才可以选今年
        year = date.getFullYear() + '';
        this.gradeData[0].push({ value: year, text: year });
        continue;
      }
      year = date.getFullYear() - i + '';
      this.gradeData[0].push({ value: year, text: year });
    }
  },
  watch: {
    'registerData.userType': function() {
      if (this.registerData.userType === 1) {
        this.registerData.major = '';
        this.registerData.sclass = '';
        this.registerData.grade = '';
      }
    },
    'registerData.faculty': function() {
      this.registerData.major = '';
      let majorData = [];
      const faculty = this.registerData.faculty.replace(' ', '');
      Object.keys(this.faculty[faculty]).forEach(major => {
        majorData.push({
          value: major,
          text: major
        });
      });
      this.majorData.push(majorData);
    },
    'registerData.major': function() {
      this.registerData.sclass = '';
      let sclassData = [];
      const faculty = this.registerData.faculty.replace(' ', '');
      const major = this.registerData.major.replace(' ', '');
      const sclassArr = this.faculty[faculty][major];
      if (sclassArr && sclassArr.length > 0) {
        sclassArr.forEach(sclass => {
          sclassData.push({
            value: sclass + '',
            text: sclass + ''
          });
        });
      }
      this.sclassData.push(sclassData);
    }
  },
  methods: {
    checkID(name, value) {
      if (value === '') {
        this.isIDOK = false;
        this.isIDError = true;
      } else {
        this.isIDOK = true;
        this.isIDError = false;
      }
    },
    checkUsername(name, value) {
      if (value === '') {
        this.isUsernameOK = false;
        this.isUsernameError = true;
      } else {
        this.isUsernameOK = true;
        this.isUsernameError = false;
      }
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
    onPickerConfirm(picker) {
      const values = this.$refs[`${picker}`].getColumnValues();

      let res = '';
      values.forEach(value => {
        value && (res += `${value.text || value.label} `);
      });

      this.registerData[`${picker}`] = res;
    },
    login() {
      let url;

      if (this.registerData.userType === 0) {
        url = '/api/stuLogin';
      } else {
        url = '/api/tchLogin';
      }

      this.$http
        .post(url, {
          id: this.registerData.id,
          password: this.registerData.password,
          userType: this.registerData.userType
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
        });
    },
    checkForm() {
      if (!this.isIDOK || !this.isPWOK || !this.isUsernameOK) {
        this.checkID(null, this.registerData.id);
        this.checkUsername(null, this.registerData.username);
        this.checkPW(null, this.registerData.password);
        return false;
      }

      if (
        this.registerData.userType !== 0 &&
        this.registerData.userType !== 1
      ) {
        this.$toast.failed('请选择您的身份');
        return false;
      }

      if (!this.registerData.faculty) {
        this.$toast.failed('请选择您所属学院');
        return false;
      }

      if (this.registerData.userType === 0) {
        if (this.registerData.grade === '') {
          this.$toast.failed('请选择您的年级');
          return false;
        }
        if (!this.registerData.major) {
          this.$toast.failed('请选择您所在专业');
          return false;
        }
        if (!this.registerData.sclass) {
          this.$toast.failed('请选择您所在班级');
          return false;
        }
      }
      return true;
    },
    submitForm() {
      if (!this.checkForm()) {
        return false;
      }

      // 提交
      this.submiting = true;

      let url;

      if (this.registerData.userType === 0) {
        url = '/api/stuRegister';
      } else {
        url = '/api/tchRegister';
      }

      this.$http
        .post(url, this.registerData)
        .then(res => {
          if (res.data.code === 1) {
            this.login();
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

.register {
  padding: 3rem 1.2rem;
}

.login {
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
