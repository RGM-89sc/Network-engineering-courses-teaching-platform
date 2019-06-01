import Vue from 'vue'
import App from './App.vue'
import router from './router';
import http from './http';
import getLoginState from './getLoginState';
import CKEditor from '@ckeditor/ckeditor5-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'normalize.css';
import FastClick from 'fastclick';
import {
  Button,
  TabBar,
  InputItem,
  Field,
  FieldItem,
  Selector,
  Icon,
  Toast,
  Picker,
  ResultPage,
  Tag,
  Dialog,
  CellItem,
  Radio,
  Check,
  CheckGroup,
  Tabs,
  TabPane,
  DetailItem,
  ActivityIndicator,
} from 'mand-mobile';

FastClick.attach(document.body);

Vue.component(Button.name, Button);
Vue.component(TabBar.name, TabBar);
Vue.component(InputItem.name, InputItem);
Vue.component(Field.name, Field);
Vue.component(FieldItem.name, FieldItem);
Vue.component(Selector.name, Selector);
Vue.component(Icon.name, Icon);
Vue.component(Picker.name, Picker);
Vue.component(ResultPage.name, ResultPage);
Vue.component(Tag.name, Tag);
Vue.component(CellItem.name, CellItem);
Vue.component(Radio.name, Radio);
Vue.component(Check.name, Check);
Vue.component(CheckGroup.name, CheckGroup);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(DetailItem.name, DetailItem);
Vue.component(ActivityIndicator.name, ActivityIndicator);

Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;

Vue.config.productionTip = false;

Vue.use(CKEditor);

Vue.config.productionTip = false;

Vue.prototype.$http = http;

Vue.prototype.$getLoginState = getLoginState;
dayjs.locale('zh-cn');
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$serverBaseUrl = 'http://localhost:9000';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
