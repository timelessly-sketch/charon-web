// src/utils/tree.ts
export function Tree(items: Entity.MenuItem[]): Entity.MenuItem[] {
  const nodeMap = new Map<number, Entity.MenuItem>()
  items.forEach((item) => {
    nodeMap.set(item.id, {
      ...item,
      children: undefined, // 明确设置为 undefined 而不是空数组
    })
  })

  const tree: Entity.MenuItem[] = []
  nodeMap.forEach((node) => {
    if (node.pid === 0) {
      tree.push(node)
    }
    else {
      const parent = nodeMap.get(node.pid)
      if (parent) {
        // 动态创建 children 数组
        if (!parent.children)
          parent.children = []
        parent.children.push(node)
      }
    }
  })
  const cleanTree = sortTree(tree).map(removeEmptyChildren)
  return cleanTree
}

// 辅助函数：移除空 children 属性
function removeEmptyChildren(node: Entity.MenuItem): Entity.MenuItem {
  if (node.children && node.children.length === 0) {
    const { children, ...rest } = node
    return rest
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map(removeEmptyChildren),
    }
  }
  return node
}

// 排序函数保持原样
function sortTree(nodes: Entity.MenuItem[]): Entity.MenuItem[] {
  return nodes.sort((a, b) => a.id - b.id)
}
