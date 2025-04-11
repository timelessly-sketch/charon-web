/* 角色数据库表字段 */
export namespace Entity {
  export interface AuthRole {
    id?: number
    roleName?: string
    roleKey?: string
    platformCode?: string
  }
}

export interface CascaderNode {
  label: string
  value: string | number
  children?: CascaderNode[]
  selectable?: boolean // 新增字段：控制是否可选
  data?: Entity.AuthRole
  isPlatform?: boolean
}
