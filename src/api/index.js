import request from '@/utils/request'

export function getArticleList(params) {
  return request({
    url: '/vue-admin-template/article/list',
    method: 'get',
    params
  })
}
