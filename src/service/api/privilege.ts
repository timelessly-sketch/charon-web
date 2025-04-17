import { request } from '../http'

export function fetchMenuList(platformCode: string) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>(
    '/privilege/menu/list',
    { params: { platformCode } },
  )
}

export function fetchMenuEdit(params: AppRoute.RowRoute) {
  return request.Post<Service.ResponseResult<any>>(
    `/privilege/menu/edit`,
    params,
  )
}

export function fetchRoleList(platformCode: string) {
  return request.Get<Service.ResponseResult<Entity.AuthRole[]>>(
    '/privilege/role/list',
    { params: { platformCode } },
  )
}

export function fetchRoleEdit(params: Entity.AuthRole) {
  return request.Post<Service.ResponseResult<any>>(
    `/privilege/role/edit`,
    params,
  )
}

export function fetchRoleDetail(id: number) {
  return request.Get<Service.ResponseResult<any>>(`/privilege/role/detail/${id}`)
}
