import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js';
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
  Pagination,
  Table,
  TableColumn
} from 'element-ui';


Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.prototype.$ELEMENT = { size: 'large', zIndex: 3000 };

Vue.use(TableColumn);
Vue.use(CKEditor);
Vue.use(Table);
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
Vue.use(Pagination);
//富文本编辑器
Vue.prototype.$message = Message;

Vue.prototype.$getLoginState = function () {
  let loginState;
  decodeURI(document.cookie)
    .split(";")
    .forEach(value => {
      if (/loginState=/.test(value)) {
        loginState = JSON.parse(value.split("=")[1]);
      }
    });
    return loginState;
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
