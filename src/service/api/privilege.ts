import { request } from '../http'

export function fetchMenuList(platformCode: string) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>(
    '/privilege/menu/list',
    { params: { platformCode } },
  )
}

export function fetchMenuEdit(params: AppRoute.RowRoute) {
  return request.Post<Service.ResponseResult<any>>(`/privilege/menu/edit`, params)
}
