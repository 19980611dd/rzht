import Vue from "vue";
import UploadExcel from "./components/UploadExcel";
import ImageUpload from "@/components/ImageUpload";
export default {
  install(Vue) {
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload); // 注册导入上传组件// 注册导入excel组件
  },
};
import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import locale from "element-ui/lib/locale/lang/en"; // lang i18n
import i18n from "@/lang/index";
import "@/styles/index.scss"; // global css
import Print from "vue-print-nb";
Vue.use(Print);
import App from "./App";
import store from "./store";
import router from "./router";
import component from "@/components";
Vue.use(component);
import "@/icons"; // icon
import "@/permission"; // permission control
// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});
// 一次性注册所有指令
import * as directives from "@/directives/index";
// 引入过滤器  注册
import * as filters from "@/filters/index";
// 所有的过滤器，进行全局注册
for (const filtersKey in filters) {
  Vue.filter(filtersKey, filters[filtersKey]);
}
// console.log(directives)
for (const key in directives) {
  Vue.directive(key, directives[key]);
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);
import Components from "@/components/toolBar/index";
Vue.use(Components);
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});
