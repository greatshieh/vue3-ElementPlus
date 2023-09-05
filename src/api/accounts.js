import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/accounts/list',
    method: 'get',
    params: query
  })
}
