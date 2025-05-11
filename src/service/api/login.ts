import { request } from '../http'

interface ILogin {
  username: string
  password: string
}

export function fetchLogin(data: ILogin) {
  const methodInstance = request.Post<Service.ResponseResult<Api.Login.Info>>('/auth/login', data)
  methodInstance.meta = {
    authRole: null,
  }
  return methodInstance
}

export function fetchUserRoutes(params: { platformCode: any }) {
  return request.Get <Service.ResponseResult<any>>(`/auth/routes`, { params })
}
