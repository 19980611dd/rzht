import request from "@/utils/request";

export function login(data) {
  // 返回一个axios对象 => promise
  return request({
    url: "/sys/login",
    method: "post",
    data,
  });
}

// 获取用户信息接口
/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: "/sys/profile",
    method: "post",
  });
}
/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
  });
}
export function getInfo(token) {}

export function logout() {}
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: "put",
    data,
  });
}
