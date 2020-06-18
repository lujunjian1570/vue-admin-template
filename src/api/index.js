import request from '@/utils/request'

const BASE_API = {
  login(data) {
    return request({
      url: '/template-web/user/login',
      method: 'post',
      data
    })
  },

  getInfo(token) {
    return request({
      url: '/template-web/user/info',
      method: 'get',
      params: { token }
    })
  },

  logout() {
    return request({
      url: '/template-web/user/logout',
      method: 'post'
    })
  },
  // 获取左侧导航数据
  getNavList(params) {
    return request({
      url: '/template-web/table/getNavList',
      method: 'get',
      params
    })
  },
  getArticleList(params) {
    return request({
      url: '/template-web/article/list',
      method: 'get',
      params
    })
  },
  selectThemeList(params) {
    return request({
      url: '/template/selectThemeList.do',
      method: 'get',
      params
    })
  }
}
export default BASE_API
