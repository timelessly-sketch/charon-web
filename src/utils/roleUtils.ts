import type { CascaderNode, Entity } from '@/typings/entities/role'

/**
 * 将角色列表转换为 Cascader 需要的层级结构
 * @param roles 角色列表
 * @returns 级联数据结构
 */
export function transformToCascader(roles: Entity.AuthRole[]): CascaderNode[] {
  const platformMap = new Map<string, CascaderNode>()

  roles.forEach((role) => {
    const platformCode = role.platformCode || 'unknown'

    // 处理平台节点
    if (!platformMap.has(platformCode)) {
      platformMap.set(platformCode, {
        label: platformCode.toUpperCase(),
        value: `platform_${platformCode}`, // 平台节点保持原标识方式
        children: [],
        selectable: false,
        isPlatform: true,
      })
    }

    // 处理角色节点
    const platformNode = platformMap.get(platformCode)!
    platformNode.children!.push({
      label: role.roleKey || '未命名角色',
      value: String(role.id!), // 强制转换为字符串，直接使用 id（关键修改）
      data: role,
      selectable: true,
    })
  })

  return Array.from(platformMap.values())
}
