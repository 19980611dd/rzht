import { constantRoutes, asyncRoutes } from "@/router";
const state = {
  // 存储了当前用户所拥有的所有路由权限
  routes: constantRoutes,
};
const mutations = {
  setRoutes(state, newRoutes) {
    // newRoutes动态路由
    // 请求到个人信息的时候，动态路由和静态路由进行合并
    state.routes = [...constantRoutes, ...newRoutes];
  },
};
const actions = {
  filterRouters(context, menus) {
    const resRouters = asyncRoutes.filter((item) => {
      return menus.includes(item.name);
    });
    console.log(resRouters);
    context.commit("setRoutes", resRouters);
    return resRouters;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
