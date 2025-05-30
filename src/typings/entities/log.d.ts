/** 请求日志数据库表字段 */
namespace Entity {
  interface Log {
    /** 日志ID */
    id?: number
    /** 请求ID */
    reqId?: string
    /** 用户名 */
    username?: string
    /** 请求URL */
    url?: string
    /** 请求方法 */
    method?: string
    /** GET参数 */
    getData?: object
    /** POST参数 */
    postData?: object
    /** 请求头数据 */
    headerData?: object
    /** 错误信息 */
    error_data?: object
    /** 用户代理 */
    userAgent?: string
    /** 浏览器类型 */
    browser?: string
    /** 请求耗时 */
    takeUpTime?: string
    /** 客户端IP */
    clientIp?: string
    /** 时间戳 */
    timestamp?: Date
    /** 响应状态码 */
    code?: number
    /** 创建时间 */
    createdAt?: Date
    /** 更新时间 */
    updatedAt?: Date
  }
}
