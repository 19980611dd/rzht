// 引入获取token方法
import { login, getUserInfo, getUserDetailById } from "@/api/user";
import { getToken, setToken, removeToken, setTime } from "@/utils/auth";
const state = {
  // 初始化的时候把本地存储里面的token复制给vuex默认值
  token: getToken(),
  userInfo: {}, // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
};
// 修改状态
const mutations = {
  // 修改token的方法
  // 设置token
  // vuex
  // cookie
  setToken(state, token) {
    state.token = token;
    setToken(token); // 本地存的设置token的方法
  },
  // 移除token
  removeToken(state) {
    state.token = null;
    removeToken();
  },
  removeUserInfo(state) {
    // 清楚用户信息
    state.userInfo = {};
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo; // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
};
const actions = {
  // 登录请求 >> cmmit >> mutations
  async login(context, data) {
    // 调用登录的请求接口
    const res = await login(data);
    // 登录的时候，设置个时间戳
    setTime();
    // 打印接口调用结果
    console.log(res);
    // 把获取到的token存到本地存储
    context.commit("setToken", res);
  },
  // 获取用户资料的action
  async getUserInfo(context) {
    const res = await getUserInfo();
    const baseInfo = await getUserDetailById(res.userId);
    // 将两个接口结果合并
    const baseResult = { ...res, ...baseInfo };
    // console.log(res)
    // 提交mutations
    context.commit("setUserInfo", baseResult);
    return res;
  },
  // 退出登陆功能
  logOut(context) {
    // 清除token，用户信息
    context.commit("removeToken");
    context.commit("removeUserInfo");
  },
};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
