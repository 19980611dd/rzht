const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 拿到state中设置的user下的token
  token: state => state.user.token,
  // 建立用户名称的映射
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  //
  companyId:state=>state.user.userInfo.companyId
}
export default getters
