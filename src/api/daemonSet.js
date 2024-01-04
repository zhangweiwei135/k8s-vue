import request from '@/utils/request'

export function DsList(data) {
  return request({
    url: '/kubernetes/workload/ds/list',
    method: 'get',
    params: { ...data }
  })
}


export function DeleteDs(data) {
  return request({
    url: '/kubernetes/workload/ds/del',
    method: 'delete',
    params: { ...data }
  })
}
