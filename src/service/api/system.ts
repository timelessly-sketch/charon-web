import { request } from '../http'

// 获取所有路由信息
export function fetchAllRoutes() {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>('/getUserRoutes')
}

// 获取所有用户信息
export function fetchUserPage() {
  return request.Get<Service.ResponseResult<Entity.User[]>>('/userPage')
}

export function fetchUserList(params: { page: number, size: number }) {
  return request.Get<Service.ResponseResult<any>>('/system/user/list', { params })
}

export function fetchUserEdit(params: Entity.User) {
  return request.Post<Service.ResponseResult<any>>('system/user/edit', params)
}

export function fetchUserDetail(id: number) {
  return request.Get<Service.ResponseResult<any>>(`/system/user/detail/${id}`)
}

export function fetchResetPass(username: string) {
  return request.Post<Service.ResponseResult<any>>(`/system/user/reset`, { username })
}

export function fetchPlatFormList(params: { page: number, size: number }) {
  return request.Get<Service.ResponseResult<any>>(`/system/platform/list`, { params })
}

export function fetchPlatformEdit(params: Entity.Platform) {
  return request.Post<Service.ResponseResult<any>>(`/system/platform/edit`, params)
}
export function fetchPlatformOptions() {
  return request.Get<Service.ResponseResult<any>>('/system/platform/options')
}
/**
 * 请求获取字典列表
 *
 * @param code - 字典编码，用于筛选特定的字典列表
 * @returns 返回的字典列表数据
 */
export function fetchDictList(code?: string) {
  const params = { code }
  return request.Get<Service.ResponseResult<Entity.Dict[]>>('/dict/list', { params })
}
