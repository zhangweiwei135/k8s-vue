import request from '@/utils/request'

export const ws_url = 'ws://124.221.177.224:32473' ;
export const upload_url = 'http://124.221.177.224:32473' ;


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

