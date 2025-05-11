<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'
import { useBoolean } from '@/hooks'
import { fetchPlatFormList } from '@/service'
import { arrayToTree, createIcon } from '@/utils'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import TableModal from './components/TableModal.vue'
import { fetchApiList } from '@/service/api/privilege'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

function deleteData(id: number) {
  window.$message.success(`删除菜单id:${id}`)
}

const tableModalRef = ref()

const columns: DataTableColumns<AppRoute.Api> = [
  {
    type: 'selection',
    width: 30,
  },
  {
    title: '名称',
    key: 'name',
    width: 200,
  },
  {
    title: '图标',
    align: 'center',
    key: 'icon',
    width: '6em',
    render: (row) => {
      return row.icon && createIcon(row.icon, { size: 20 })
    },
  },
  {
    title: '标题',
    align: 'center',
    key: 'title',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '接口路径',
    key: 'path',
    ellipsis: {
      tooltip: true,
    },
    render: (row) => {
      return row.path || '-'
    },
  },
  {
    title: '方法',
    align: 'center',
    key: 'method',
    render: (row) => {
      return row.method || '-'
    },
  },
  {
    title: '接口类型',
    align: 'center',
    key: 'apiType',
    width: '6em',
    render: (row) => {
      const apiType = row.apiType || 'page'
      const apiTagType: Record<AppRoute.ApiType, NaiveUI.ThemeColor> = {
        dir: 'primary',
        api: 'warning',
      }
      return <NTag type={apiTagType[apiType]}>{apiType}</NTag>
    },
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createdAt',
    width: 200,
  },
  {
    title: '更新时间',
    align: 'center',
    key: 'updatedAt',
    width: 200,
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    width: '15em',
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton
            size="small"
            onClick={() => tableModalRef.value.openModal('view', row)}
          >
            查看
          </NButton>
          <NButton
            size="small"
            onClick={() => tableModalRef.value.openModal('edit', row)}
          >
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => deleteData(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size="small" type="error">删除</NButton>,
            }}
          </NPopconfirm>
        </NSpace>
      )
    },
  },
]

const tableData = ref<AppRoute.Api[]>([])
const platformData = ref<Entity.Platform[]>([])
const currentPlatform = ref<Entity.Platform>()

onMounted(() => {
  getApiList()
})

async function getApiList() {
  startLoading()
  await fetchPlatFormList({ page: 1, size: 99 }).then((res: any) => {
    platformData.value = res.data.records || []
  })
  currentPlatform.value = platformData.value[0]
  if (!currentPlatform.value.platformCode) {
    return
  }
  await loadApiData()
  endLoading()
}

async function handlePlatformClick(platform: Entity.Platform) {
  currentPlatform.value = platform
  if (platform.platformCode) {
    await loadApiData()
  }
  else {
    window.$message.warning('该平台未配置编码')
  }
}

async function loadApiData() {
  startLoading()
  if (!currentPlatform.value?.platformCode) {
    window.$message.warning('请先选择有效平台')
    return
  }
  await fetchApiList(currentPlatform.value.platformCode).then((res: any) => {
    tableData.value = arrayToTree(res.data.records || [])
  })
  endLoading()
}

const checkedRowKeys = ref<number[]>([])
async function handlePositiveClick() {
  window.$message.success(`批量删除id:${checkedRowKeys.value.join(',')}`)
}
</script>

<template>
  <n-flex>
    <n-card class="w-60">
      <n-list hoverable clickable>
        <n-list-item
          v-for="platform in platformData"
          :key="platform.id"
          :class="{ 'selected-platform': platform === currentPlatform }"
          @click="handlePlatformClick(platform)"
        >
          <n-thing>
            <template #avatar>
              <component
                :is="createIcon(platform.icon)"
                v-if="platform.icon"
                size="20"
              />
            </template>
            <template #header>
              <span style="font-weight: normal; font-size: 14px">
                {{ platform.platformName || '未命名平台' }}
              </span>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>

    <NSpace vertical class="flex-1">
      <n-card class="flex-1">
        <template #header>
          <NButton type="primary" @click="tableModalRef.openModal('add', null, currentPlatform?.platformCode)">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            新建
          </NButton>
        </template>

        <template #header-extra>
          <n-flex>
            <NButton type="primary" secondary @click="getApiList">
              <template #icon>
                <icon-park-outline-refresh />
              </template>
              刷新
            </NButton>
            <NPopconfirm
              @positive-click="handlePositiveClick"
            >
              <template #trigger>
                <NButton type="error" secondary>
                  <template #icon>
                    <icon-park-outline-delete-five />
                  </template>
                  批量删除
                </NButton>
              </template>
              确认删除所有选中菜单？
            </NPopconfirm>
          </n-flex>
        </template>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :row-key="(row:AppRoute.RowRoute) => row.id" :columns="columns" :data="tableData"
          :loading="loading"
          size="small"
        />
        <TableModal ref="tableModalRef" :all-apis="tableData" modal-name="接口" @update="loadApiData" />
      </n-card>
    </NSpace>
  </n-flex>
</template>

<style scoped>
.selected-platform {
  background-color: rgba(25, 113, 194, 0.1);
}
</style>
