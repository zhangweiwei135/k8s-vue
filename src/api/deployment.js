import request from '@/utils/requestCluster'

export function deployList(data) {
  return request({
    url: '/kubernetes/workload/deployment/list',
    method: 'get',
    params: { ...data }
  })
}

export function UpdateDeployReplicas(data) {
  return request({
    url: '/kubernetes/workload/deployment/replicas/update',
    method: 'post',
    params: { ...data }
  })
}


export function DeleteDeploy(data) {
  return request({
    url: '/kubernetes/workload/deployment/del',
    method: 'delete',
    params: { ...data }
  })
}
