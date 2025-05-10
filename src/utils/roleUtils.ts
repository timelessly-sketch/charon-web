/**
 * 将角色列表转换为 Cascader 需要的层级结构
 * @param roles 角色列表
 * @returns 级联数据结构
 */
export function transformToCascader(roles: Entity.AuthRole[]): Entity.CascaderNode[] {
  const platformMap = new Map<string, Entity.CascaderNode>()

  roles.forEach((role) => {
    const platformCode = role.platformCode || 'unknown'

    // 处理平台节点（value 为字符串）
    if (!platformMap.has(platformCode)) {
      platformMap.set(platformCode, {
        label: platformCode,
        value: `platform_${platformCode}`, // 平台节点 value 是字符串
        children: [],
        selectable: false,
        isPlatform: true,
      })
    }

    // 处理角色节点（value 为数字）
    const platformNode = platformMap.get(platformCode)!
    platformNode.children!.push({
      label: role.roleKey || '未命名角色',
      value: role.id!, // 角色节点 value 是 number
      data: role,
      selectable: true,
    })
  })

  return Array.from(platformMap.values())
}
