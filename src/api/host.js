

import request from '@/utils/request'

export function hostList() {
  return request({
    url: '/cmdb/host/list',
    method: 'get'
  })
}

export function hostAdd(data) {
  return request({
    url: '/cmdb/host/add',
    method: 'post',
    params: { ...data }
  })
}

export function hostDel(data) {
  return request({
    url: '/cmdb/host/del',
    method: 'delete',
    params: { ...data }
  })
}

export function hostUpdate(data) {
  return request({
    url: '/cmdb/host/update',
    method: 'put',
    params: { ...data }
  })
}

export function paginationListHost(data) {
  return request({
    url: '/cmdb/host/pageList',
    method: 'get',
    params: { ...data }
  })
}

export function searchHost(data) {
  return request({
    url: '/cmdb/host/search',
    method: 'get',
    params: { ...data }
  })
}


export function hostScript(data) {
  return request({
    url: '/cmdb/host/script',
    method: 'post',
    params: { ...data }
  })
}






