namespace Entity {
  interface AuthRole {
    id: number
    roleName?: string
    roleKey?: string
    platformCode?: string
    roleSort?: number
    status?: number
    createdAt?: Date
    menuIds?: number[]
    apiIds?: number[]
    menuList?: AppRoute.RowRoute[]
    apiList?: AppRoute.Api[]
  }
  interface CascaderNode {
    label: string
    value: string | number
    children?: CascaderNode[]
    selectable?: boolean
    data?: Entity.AuthRole
    isPlatform?: boolean
  }
}
