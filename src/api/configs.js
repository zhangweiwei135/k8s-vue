import request from '@/utils/requestCluster'

export function cmList(data) {
  return request({
    url: '/kubernetes/workload/cm/list',
    method: 'get',
    params: { ...data }
  })
}


export function DeleteCm(data) {
  return request({
    url: '/kubernetes/workload/cm/del',
    method: 'delete',
    params: { ...data }
  })
}


export function secretList(data) {
  return request({
    url: '/kubernetes/workload/secret/list',
    method: 'get',
    params: { ...data }
  })
}


export function DeleteSecret(data) {
  return request({
    url: '/kubernetes/workload/secret/del',
    method: 'delete',
    params: { ...data }
  })
}
