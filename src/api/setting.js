import request from '@/utils/request'

export function userList() {
  return request({
    url: '/setting/user/list',
    method: 'get'
  })
}

export function userAdd(data) {
  return request({
    url: '/setting/user/add',
    method: 'post',
    params: { ...data }
  })
}

export function userDel(data) {
  return request({
    url: '/setting/user/del',
    method: 'delete',
    params: { ...data }
  })
}

export function userUpdate(data) {
  return request({
    url: '/setting/user/update',
    method: 'put',
    params: { ...data }
  })
}

export function paginationList(data) {
  return request({
    url: '/setting/user/pageList',
    method: 'get',
    params: { ...data }
  })
}

export function searchUser(data) {
  return request({
    url: '/setting/user/search',
    method: 'get',
    params: { ...data }
  })
}
