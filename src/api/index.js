import request from '@/utils/request'

/* export function getArticleList(params) {
  return request({
    url: '/vue-admin-template/article/list',
    method: 'get',
    params
  })
}*/

const BASE_API = {
  /* getArticleList(params) {
    return request({
      url: '/vue-admin-template/article/list',
      method: 'get',
      params
    })
  },*/
  selectThemeList(params) {
    return request({
      url: '/template/selectThemeList.do',
      method: 'get',
      params
    })
  }
}
export default BASE_API
