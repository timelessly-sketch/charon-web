import { request } from '@/service/http'

export function fetchGetDemo(params: any) {
  return request.Get('/hello', { params })
}
