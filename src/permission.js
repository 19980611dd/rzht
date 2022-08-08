import store from "@/store";
import NProgress from "nprogress";
import router from "./router";

const loginPath = "/login";
const notFoundPath = "/404";

const whiteList = [loginPath, notFoundPath];
// 加载动画
NProgress.start();
// 监听路由变化
router.beforeEach(async (to, from, next) => {
  // 1.是否有token
  const token = store.getters.token;
  if (token) {
    // 有token没有用户信息的时候
    if (!store.getters.userId) {
      const res = await store.dispatch("user/getUserInfo");
      console.log(res.roles.menus);
      const routes = await store.dispatch(
        "permission/filterRouters",
        res.roles.menus
      );
      console.log(routes);
      router.addRoutes(routes); // 添加动态路由到路由表  铺路
      next(to.path);
    }
    // 判断是否去登录页
    if (to.path === loginPath) {
      next("/");
    } else {
      // 放行
      next();
    }
  } else {
    // 查看是否在白名单
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 没token，还不是白名单，直接返回到登录页
      next(loginPath);
    }
  }
});

router.afterEach(() => {
  setTimeout(() => {
    NProgress.done();
  }, 2000);
});
