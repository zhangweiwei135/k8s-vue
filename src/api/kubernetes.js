import request from '@/utils/request'

export function k8sList() {
  return request({
    url: '/kubernetes/clusterInfo/list',
    method: 'get',
  })
}

export function k8sAdd(data) {
  return request({
    url: '/kubernetes/clusterInfo/add',
    method: 'post',
    params: { ...data }
  })
}

export function k8sDel(data) {
  return request({
    url: '/kubernetes/clusterInfo/del',
    method: 'delete',
    params: { ...data }
  })
}


export function k8sUpdate(data) {
  return request({
    url: '/kubernetes/clusterInfo/update',
    method: 'put',
    params: { ...data }
  })
}


export function nsList(data) {
  return request({
    url: '/kubernetes/clusterInfo/nslist',
    method: 'get',
    params: { ...data }
  })
}


