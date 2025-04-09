<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { NButton, NCard, NIcon, NPopover, NSpace } from 'naive-ui'
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
    ],
  },
]

const showPopover = ref(false)
const currentChildren = ref<MenuOption[]>([])
const triggerRef = ref<HTMLElement | null>(null)
const triggerX = ref(0)
const triggerY = ref(0)

function handleMouseEnter(option: MenuOption) {
  if (!triggerRef.value)
    return

  const rect = triggerRef.value.getBoundingClientRect()
  triggerX.value = rect.left
  triggerY.value = rect.bottom + window.scrollY

  if (option.children) {
    currentChildren.value = option.children
    showPopover.value = true
  }
}

function handleMouseLeave(event: MouseEvent) {
  const popover = document.querySelector('.n-popover')
  if (popover?.contains(event.relatedTarget as Node))
    return
  showPopover.value = false
}
</script>

<template>
  <div>
    <NSpace style="margin-left: 10px" align="baseline">
      <div
        ref="triggerRef"
        @mouseenter="handleMouseEnter(menuOptions[0])"
        @mouseleave="handleMouseLeave"
      >
        <NButton size='large' text>
          <NIcon :component="BagOutlineIcon" style="padding-right: 21px;"/>
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
      <NCard
        :bordered="false"
        style="width: 400px; box-shadow: 0 3px 6px rgba(0,0,0,0.16)"
      >
        <NSpace justify="space-around" style="padding: 12px 0">
          <NButton
            v-for="child in currentChildren"
            :key="child.key"
            text
            style="padding: 8px 16px"
            @click="showPopover = false"
          >
            {{ child.label }}
          </NButton>
        </NSpace>
      </NCard>
    </NPopover>
  </div>
</template>

<style scoped>
</style>
