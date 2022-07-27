import axios from 'axios'
import { Message } from 'element-ui'
// 引入store
import store from '@/store'
// 获取时间错
import { getTime } from '@/utils/auth'
import router from '@/router'
// 定义超时时间
const request = axios.create({
  // 设置axios请求的基础的基础地址
  baseURL: process.env.VUE_APP_BASE_API
})
// 设置过期时间(ms)
const timeOut = 6000000
// 如果过期了，返回false
function isCheckTime() {
  return Date.now() - getTime() < timeOut
}

// 请求拦截器
request.interceptors.request.use(config => {
  // if have token ,put it in the headers when request
  const token = store.getters.token
  if (token) {
    // token携带到请求头
    // 如果没过期，就去设置请求头中的token
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登录过期，请重新登录')
      // 调用退出方法
      store.dispatch('user/logOut')
      // 跳转到登录页
      router.push('/')
      return Promise.reject('')
    }
  }
  // need to return config
  return config
}, error => Promise.reject(error))
// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { success, data, message }} = response
  console.log(message)
  if (success) {
    return data
  }
  // 代码走到这里，证明success不存在>>请求接口有问题
  Message.error(message || '后端错误')
  // 失败的promise >> 接口请求的地方报错
  return Promise.reject(message || '后端错误')
}, error => {
  if (error.response.status === 401) {
    // 退出登录
    store.dispatch('user/logOut')
    // 跳转至登录页
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request
