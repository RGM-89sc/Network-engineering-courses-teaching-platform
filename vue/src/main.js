import Vue from 'vue';
import App from './App.vue';
import router from './router';
import http from './http';
import getLoginState from './getLoginState';
import CKEditor from '@ckeditor/ckeditor5-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  Header,
  Menu,
  MenuItem,
  Main,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Button,
  Message,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Table,
  TableColumn,
  Upload,
  Dialog,
  MessageBox,
  InputNumber,
  Loading,
  ColorPicker,
  Slider,
  Card,
  Timeline,
  TimelineItem,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  DatePicker,
  Tag
} from 'element-ui';

Vue.config.productionTip = false;

Vue.prototype.$ELEMENT = { size: 'large', zIndex: 3000 };

Vue.use(CKEditor);

Vue.use(Header);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(InputNumber);
Vue.use(Loading.directive);
Vue.use(ColorPicker);
Vue.use(Slider);
Vue.use(Card);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Tag);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$http = http;

Vue.prototype.$getLoginState = getLoginState;
dayjs.locale('zh-cn');
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$serverBaseUrl = 'http://localhost:9000';

// 路由鉴权
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    const userType = window.sessionStorage.getItem('user.userType');
    if (to.meta.auth === 'all') {
      if (userType !== '0' && userType !== '1') {
        return next({ path: '/auth' });  // 登录界面
      }
    } else if (to.meta.auth === 'tch') {
      if (!userType) {
        return next({ path: '/auth' });  // 登录界面
      }
      if (userType !== '1') {
        return next({ path: '/noAuthorization' });
      }
    } else if (to.meta.auth === 'stu') {
      if (!userType) {
        return next({ path: '/auth' });  // 登录界面
      }
      if (userType !== '0') {
        return next({ path: 'noAuthorization' });
      }
    }
  }
  next();
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
