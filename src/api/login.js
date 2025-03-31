import request from '@/utils/request'

// 登录方法
export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    // url: 'http://172.16.3.31:3333/api/system/auth/token',
    url: '/system/auth/token',
    headers: {
      isToken: false,
      repeatSubmit: false,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/auth/current_user',
    method: 'post'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
