<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { NButton, NIcon, NPopover, NSpace, NGrid, NGi } from 'naive-ui'
import { BagOutline as BagOutlineIcon } from '@vicons/ionicons5'

const name = '产品列表'

const menuOptions = [
  {
    label: '产品列表',
    key: 'main',
    children: [
      { label: '子项1', key: '1' },
      { label: '子项2', key: '2' },
      { label: '子项3', key: '3' },
      { label: '子项4', key: '4' },
      { label: '子项5', key: '5' },
      { label: '子项6', key: '6' },
      { label: '子项6', key: '6' },
      { label: '子项6', key: '6' },
      { label: '子项6', key: '6' },
    ],
  },
]

const showPopover = ref(false)
const currentChildren = ref<MenuOption[]>([])
const triggerRef = ref<HTMLElement | null>(null)
const triggerX = ref(0)
const triggerY = ref(0)

function toggleMenu() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  triggerX.value = rect.left
  triggerY.value = rect.bottom + window.scrollY

  if (menuOptions[0].children) {
    currentChildren.value = menuOptions[0].children
    showPopover.value = !showPopover.value
  }
}

function handleClickOutside(event: MouseEvent) {
  if (triggerRef.value?.contains(event.target as Node)) {
    return
  }
  showPopover.value = false
}

function handleItemClick(item: MenuOption) {
  console.log('点击了:', item.label)
  // 这里可以添加你的业务逻辑
  showPopover.value = false // 点击后关闭菜单
}
</script>

<template>
  <div @click="handleClickOutside">
    <NSpace style="margin-left: 10px" align="baseline">
      <div ref="triggerRef">
        <NButton size="large" text @click.stop="toggleMenu">
          <NIcon :component="BagOutlineIcon" style="padding-right: 21px;" />
          {{ name }}
        </NButton>
      </div>
    </NSpace>
    <NPopover
      :show="showPopover"
      placement="bottom-start"
      :x="triggerX"
      :y="triggerY"
      trigger="manual"
      style="margin-top: 8px"
    >
      <n-grid :cols="5" :x-gap="10" :y-gap="8" style="width: 1000px; padding: 4px;">
        <n-gi
          v-for="item in currentChildren"
          :key="item.key"
          :class="parseInt(item.key) % 2 ? 'green' : 'light-green'"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
        </n-gi>
      </n-grid>
    </NPopover>
  </div>
</template>

<style scoped>
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.light-green:hover, .green:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
