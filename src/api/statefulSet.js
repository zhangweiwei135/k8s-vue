import request from '@/utils/request'

export function StsList(data) {
  return request({
    url: '/kubernetes/workload/statefulSet/list',
    method: 'get',
    params: { ...data }
  })
}

export function UpdateStsReplicas(data) {
  return request({
    url: '/kubernetes/workload/statefulSet/replicas/update',
    method: 'put',
    params: { ...data }
  })
}


export function DeleteSts(data) {
  return request({
    url: '/kubernetes/workload/statefulSet/del',
    method: 'delete',
    params: { ...data }
  })
}
