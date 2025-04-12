import { request } from '../http'

export function fetchMenuList(platformCode: string) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>(
    '/privilege/menu/list',
    { params: { platformCode } },
  )
}
