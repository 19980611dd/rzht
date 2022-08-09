// import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImageUpload from "./ImageUpload";
// import ScreenFull from "./ScreenFull/";
import ThemePicker from "@/layout/components/ThemePicker.vue";
import TagsView from "./TagsView";

export default function (Vue) {
  // Vue.component("PageTools", PageTools); // 注册工具栏组件
  Vue.component("UploadExcel", UploadExcel); // 注册导入excel组件
  Vue.component("ImageUpload", ImageUpload); // 注册导入excel组件
  // Vue.component("ScreenFull", ScreenFull); // 注册全屏组件
  Vue.component("ThemePicker", ThemePicker); //注册多主题组件
  Vue.component("TagsView", TagsView); //注册多页签组件
}
