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
  Tag,
  Tabs,
  TabPane,
  Divider,
  ButtonGroup,
  Progress
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
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Divider);
Vue.use(ButtonGroup);
Vue.use(Progress);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$http = http;

Vue.prototype.$getLoginState = getLoginState;
dayjs.locale('zh-cn');
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$serverBaseUrl = 'http://localhost:9000';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');