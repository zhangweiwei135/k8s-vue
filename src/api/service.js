import request from '@/utils/request'

export function SvcList(data) {
  return request({
    url: '/kubernetes/workload/svc/list',
    method: 'get',
    params: { ...data }
  })
}


export function DeleteSvc(data) {
  return request({
    url: '/kubernetes/workload/svc/del',
    method: 'delete',
    params: { ...data }
  })
}


export function IngressList(data) {
  return request({
    url: '/kubernetes/workload/ingress/list',
    method: 'get',
    params: { ...data }
  })
}


export function DeleteIngress(data) {
  return request({
    url: '/kubernetes/workload/ingress/del',
    method: 'delete',
    params: { ...data }
  })
}
