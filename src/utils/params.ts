/**
 * 过滤对象中的空值属性 (支持过滤空字符串、null、undefined)
 * @param obj 原始对象
 * @returns 过滤后的新对象
 */
export function filterEmptyParams<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key as keyof T] = value
    }
    return acc
  }, {} as Partial<T>)
}
