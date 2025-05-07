<script setup lang="tsx">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { useBoolean } from '@/hooks'
import TableModal from './components/TableModal.vue'
import { filterEmptyParams } from '@/utils/params'
import { fetchResetPass, fetchUserList } from '@/service'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
const page = ref(1)
const size = ref(10)
const initialModel = {
  username: '',
  name: '',
}
const model = ref({ ...initialModel })
function handleResetSearch() {
  model.value = { ...initialModel }
}

const formRef = ref<FormInst | null>()
const modalRef = ref()

function deleteUser(id: number) {
  window.$message.success(`删除用户id:${id}`)
}

function handleUserUpdate() {
  getUserList() // 重新获取用户列表数据
}

const columns: DataTableColumns<Entity.User> = [
  {
    title: '序号',
    align: 'center',
    key: 'id',
  },
  {
    title: '用户昵称',
    align: 'center',
    key: 'nickName',
  },
  {
    title: '英文名',
    align: 'center',
    key: 'userName',
  },
  {
    title: '用户姓名',
    align: 'center',
    key: 'name',
  },
  {
    title: '邮箱',
    align: 'center',
    key: 'email',
  },
  {
    title: '部门',
    align: 'center',
    key: 'department',
  },
  {
    title: '手机号',
    align: 'center',
    key: 'phone',
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createdAt',
  },
  {
    title: '状态',
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
          <NPopconfirm onPositiveClick={() => resetPassword(row.userName!)}>
            {{
              default: () => '重置密码后用户名与密码一致。',
              trigger: () => <NButton size="small" type="warning">重置密码</NButton>,
            }}
          </NPopconfirm>

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
const listData = ref<Entity.User[]>([])

async function getUserList() {
  startLoading()
  const params = {
    page: page.value,
    size: size.value,
    ...filterEmptyParams(model.value),
  }
  await fetchUserList(params).then((res: any) => {
    listData.value = res.data.records || []
    count.value = res.data.total
    endLoading()
  })
}

async function resetPassword(username: string) {
  startLoading()
  const { isSuccess } = await fetchResetPass(username)
  if (isSuccess) {
    window.$message?.success('重置成功')
  }
  endLoading()
}

onMounted(() => {
  getUserList()
})

function changePage(currentPage: number, currentPageSize: number) {
  page.value = currentPage
  size.value = currentPageSize
  getUserList()
}
</script>

<template>
  <n-flex>
    <NSpace vertical class="flex-1">
      <n-card>
        <n-form ref="formRef" :model="model" label-placement="left" inline :show-feedback="false">
          <n-flex>
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="model.username" placeholder="请输入" />
            </n-form-item>
            <n-form-item label="用户姓名" path="name">
              <n-input v-model:value="model.name" placeholder="请输入" />
            </n-form-item>
            <n-flex class="ml-auto">
              <NButton type="primary" @click="getUserList">
                <template #icon>
                  <icon-park-outline-search />
                </template>
                搜索
              </NButton>
              <NButton strong secondary @click="handleResetSearch">
                <template #icon>
                  <icon-park-outline-redo />
                </template>
                重置
              </NButton>
            </n-flex>
          </n-flex>
        </n-form>
      </n-card>

      <n-card class="flex-1">
        <template #header>
          <NButton type="primary" @click="modalRef.openModal('add')">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            新建用户
          </NButton>
        </template>
        <NSpace vertical>
          <n-data-table :columns="columns" :data="listData" :loading="loading" />
          <n-flex justify="right">
            <Pagination :count="count" @change="changePage" />
          </n-flex>
        </NSpace>
        <TableModal ref="modalRef" modal-name="用户" @update="handleUserUpdate" />
      </n-card>
    </NSpace>
  </n-flex>
</template>
