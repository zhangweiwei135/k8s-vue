import request from '@/utils/requestCluster'

export const ws_url = 'ws://localhost:8083' ;


export function podsList(data) {
  return request({
    url: '/kubernetes/workload/pod/list',
    method: 'get',
    params: { ...data }
  })
}


export function codeEdit(data) {
  return request({
    url: '/kubernetes/workload/code/edit',
    method: 'post',
    params: { ...data }
  })
}

