<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { useBoolean } from '@/hooks'
import { fetchPlatFormList } from '@/service'
import { createIcon } from '@/utils'
import TableModal from './components/TableModal.vue'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
const page = ref(1)
const size = ref(10)
const modalRef = ref()

function deleteUser(id: number) {
  window.$message.success(`删除平台id:${id}`)
}

function handlePlatformUpdate() {
  getPlatFormList()
}

const columns: DataTableColumns<Entity.Platform> = [
  {
    title: '序号',
    align: 'center',
    key: 'id',
  },
  {
    title: '平台名称',
    align: 'center',
    key: 'platformName',
  },
  {
    title: '平台图标',
    align: 'center',
    key: 'icon',
    width: '6em',
    render: (row) => {
      return row.icon && createIcon(row.icon, { size: 20 })
    },
  },
  {
    title: '平台编码',
    align: 'center',
    key: 'platformCode',
  },
  {
    title: '平台地址',
    align: 'center',
    key: 'serverUrl',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
          bordered: false,
        },
        { default: () => row.serverUrl },
      )
    },
  },
  {
    title: '默认路由',
    align: 'center',
    key: 'defaultRoute',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
          bordered: false,
        },
        { default: () => row.defaultRoute },
      )
    },
  },
  {
    title: '平台排序',
    align: 'center',
    key: 'platformSort',
  },
  {
    title: '平台状态',
    align: 'center',
    key: 'status',
    render(row) {
      return h(NTag, {
        type: row.status === 1 ? 'success' : 'error',
        bordered: false,
      }, {
        default: () => row.status === 1 ? '正常' : '禁用',
      })
    },
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createdAt',
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton
            size="small"
            type="info"
            onClick={() => modalRef.value.openModal('edit', row)}
          >
            编辑
          </NButton>

          <NPopconfirm onPositiveClick={() => deleteUser(row.id!)}>
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

const count = ref(0)
const listData = ref<Entity.Platform[]>([])

async function getPlatFormList() {
  startLoading()
  const params = {
    page: page.value,
    size: size.value,
  }
  await fetchPlatFormList(params).then((res: any) => {
    listData.value = res.data.records || []
    count.value = res.data.total
    endLoading()
  })
}

onMounted(() => {
  getPlatFormList()
})

function changePage(currentPage: number, currentPageSize: number) {
  page.value = currentPage
  size.value = currentPageSize
  getPlatFormList()
}
</script>

<template>
  <n-flex>
    <NSpace vertical class="flex-1">
      <n-card class="flex-1">
        <template #header>
          <NButton type="primary" @click="modalRef.openModal('add')">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            新建平台
          </NButton>
        </template>
        <NSpace vertical>
          <n-data-table :columns="columns" :data="listData" :loading="loading" />
          <n-flex justify="right">
            <Pagination :count="count" @change="changePage" />
          </n-flex>
        </NSpace>
        <TableModal ref="modalRef" modal-name="平台" @update="handlePlatformUpdate" />
      </n-card>
    </NSpace>
  </n-flex>
</template>
