<script setup lang="ts">
import { NButton, NGi, NGrid, NIcon, NPopover } from 'naive-ui'
import { BagOutline as BagOutlineIcon } from '@vicons/ionicons5'
import { ref } from 'vue'

const name = '产品列表'
const showPopover = ref(false)
const gridWidth = ref(1000)

const menuOptions = [
  { label: '产品分类1', key: 'cat1', color: 'light-green' },
  { label: '产品分类2', key: 'cat2', color: 'green' },
  { label: '产品分类3', key: 'cat3', color: 'light-green' },
  { label: '产品分类4', key: 'cat4', color: 'green' },
  { label: '产品分类5', key: 'cat5', color: 'light-green' },
  { label: '产品分类6', key: 'cat6', color: 'green' },
]

function handleClickMenu(key: string) {
  console.log('选中菜单:', key)
  showPopover.value = false
}

function calculateWidth() {
  const screenWidth = window.innerWidth
  gridWidth.value = Math.floor((screenWidth - 240) * 0.9)
}

// 添加窗口resize监听
onMounted(() => {
  calculateWidth()
  window.addEventListener('resize', calculateWidth)
})

// 移除监听
onUnmounted(() => {
  window.removeEventListener('resize', calculateWidth)
})
</script>

<template>
  <NPopover
    placement="bottom-start"
    trigger="click"
    :show="showPopover"
    @update:show="(val) => (showPopover = val)"
  >
    <NGrid :cols="5" :x-gap="16" :y-gap="16" :style="{ padding: '10px', width: `${gridWidth}px` }">
      <NGi
        v-for="item in menuOptions"
        :key="item.key"
        :class="item.color"
        @click="handleClickMenu(item.key)"
      >
        <div class="menu-item-content">
          <NIcon :component="BagOutlineIcon" size="24" />
          <div style="margin-top: 8px">
            {{ item.label }}
          </div>
        </div>
      </NGi>
    </NGrid>

    <template #trigger>
      <NButton style="margin-left: 10px" size="large" text @click="showPopover = !showPopover">
        <NIcon
          :component="BagOutlineIcon"
          style="padding-right: 21px"
          aria-hidden="true"
        />
        {{ name }}
      </NButton>
    </template>
  </NPopover>
</template>

<style scoped>
/* 穿透子组件样式 */
:deep(.light-green),
:deep(.green) {
  height: 100px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

:deep(.light-green) {
  background-color: rgba(0, 128, 0, 0.12);
}

:deep(.green) {
  background-color: rgba(0, 128, 0, 0.24);
}

/* 悬停效果 */
:deep(.light-green:hover),
:deep(.green:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  width: 100%; /* 确保点击区域充满整个网格 */
}
</style>
