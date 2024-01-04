import request from '@/utils/request'

export function alertList() {
  return request({
    url: '/order/alert/list',
    method: 'get'
  })
}

export function alertAdd(data) {
  return request({
    url: '/order/alert/add',
    method: 'post',
    params: { ...data }
  })
}

export function alertDel(data) {
  return request({
    url: '/order/alert/del',
    method: 'delete',
    params: { ...data }
  })
}

export function alertUpdate(data) {
  return request({
    url: '/order/alert/update',
    method: 'put',
    params: { ...data }
  })
}

export function paginationListAlert(data) {
  return request({
    url: '/order/alert/pageList',
    method: 'get',
    params: { ...data }
  })
}

export function searchAlert(data) {
  return request({
    url: '/order/alert/search',
    method: 'get',
    params: { ...data }
  })
}



