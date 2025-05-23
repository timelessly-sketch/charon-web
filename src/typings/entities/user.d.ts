/** 用户数据库表字段 */
namespace Entity {
  interface User {
    /** 用户id */
    id?: number
    /** 用户名 */
    username?: string
    name?: string
    userId?: string
    /* 用户头像 */
    avatar?: string
    /* 用户性别 */
    gender?: 0 | 1
    /* 用户邮箱 */
    email?: string
    /* 用户昵称 */
    nickname?: string
    /* 用户电话 */
    phone?: string
    /** 用户角色类型 */
    roleIds: number[]
    /** 用户状态 */
    status?: 0 | 1
    /** 备注 */
    remark?: string
  }
}
