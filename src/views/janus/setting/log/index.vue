<script setup lang="tsx">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NCard, NDescriptions, NDescriptionsItem, NFlex, NSpace, NTag, NCode } from 'naive-ui'
import { useBoolean } from '@/hooks'
import { filterEmptyParams } from '@/utils/params'
import { fetchLogList } from '@/service'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
const page = ref(1)
const size = ref(15)
const initialModel = {
  username: '',
  path: '',
  clientIp: '',
}
const model = ref({ ...initialModel })
function handleResetSearch() {
  model.value = { ...initialModel }
}

const formRef = ref<FormInst | null>()

const columns: DataTableColumns<Entity.Log> = [
  {
    title: '序号',
    align: 'center',
    key: 'id',
  },
  {
    title: '用户名称',
    align: 'center',
    key: 'username',
  },
  {
    title: '客户地址',
    align: 'center',
    key: 'clientIp',
  },
  {
    title: '请求方法',
    align: 'center',
    key: 'method',
  },
  {
    title: '请求接口',
    align: 'center',
    key: 'url',
  },
  {
    title: '操作结果',
    align: 'center',
    key: 'code',
    render: (row) => {
      return row.code === 0
        ? <NTag type="success" size="small">操作成功</NTag>
        : <NTag type="error" size="small">操作失败</NTag>
    },
  },
  {
    title: '响应时间',
    align: 'center',
    key: 'takeUpTime',
    render: row => `${row.takeUpTime}ms`,
  },
  {
    title: '浏览器',
    align: 'center',
    key: 'browser',
  },
  {
    title: '访问时间',
    align: 'center',
    key: 'timestamp',
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
            onClick={() => handleEdit(row)}
          >
            查看详情
          </NButton>
        </NSpace>
      )
    },
  },
]
const count = ref(0)
const listData = ref<Entity.Log[]>([])
const activeLog = ref<Entity.Log | null>(null)
const showDetail = ref(false)

async function getLogList() {
  startLoading()
  showDetail.value = false
  const params = {
    page: page.value,
    size: size.value,
    ...filterEmptyParams(model.value),
  }
  await fetchLogList(params).then((res: any) => {
    listData.value = res.data.records || []
    count.value = res.data.total
    endLoading()
  })
}

onMounted(() => {
  getLogList()
})

function changePage(currentPage: number, currentPageSize: number) {
  page.value = currentPage
  size.value = currentPageSize
  getLogList()
}

function handleEdit(record: Entity.Log) {
  activeLog.value = record
  showDetail.value = true
}

function handleBackToList() {
  showDetail.value = false
  activeLog.value = null
}
</script>

<template>
  <NFlex>
    <NSpace vertical class="flex-1">
      <NCard>
        <n-form ref="formRef" :model="model" label-placement="left" inline :show-feedback="false">
          <NFlex>
            <n-form-item label="操作人" path="username">
              <n-input v-model:value="model.username" placeholder="请输入操作人英文名" />
            </n-form-item>
            <n-form-item label="接口" path="path">
              <n-input v-model:value="model.path" placeholder="请输入接口" />
            </n-form-item>
            <n-form-item label="客户端IP" path="clientIp">
              <n-input v-model:value="model.clientIp" placeholder="请输入IP" />
            </n-form-item>
            <NFlex class="ml-auto">
              <NButton type="primary" @click="getLogList">
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
            </NFlex>
          </NFlex>
        </n-form>
      </NCard>

      <NCard class="flex-1">
        <NSpace v-if="!showDetail" vertical>
          <n-data-table :columns="columns" :data="listData" :loading="loading" />
          <NFlex justify="right">
            <Pagination :count="count" @change="changePage" />
          </NFlex>
        </NSpace>

        <!-- 日志详情视图 -->
        <div v-else class="log-detail">
          <div style="margin-bottom: 15px">
            <NButton type="primary" @click="handleBackToList">
              <template #icon>
                <icon-park-outline-left />
              </template>
              返回列表
            </NButton>
          </div>

          <NDescriptions v-if="activeLog" label-placement="left" bordered label-align="center">
            <NDescriptionsItem label="操作人">
              <NTag>{{ activeLog.username }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="操作结果">
              <NTag :type="activeLog.code === 0 ? 'success' : 'error'">
                {{ activeLog.code === 0 ? '操作成功' : '操作失败' }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="客户端IP">
              {{ activeLog.clientIp }}
            </NDescriptionsItem>
            <NDescriptionsItem label="请求方法">
              <NTag type="info">
                {{ activeLog.method }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="请求接口">
              {{ activeLog.url }}
            </NDescriptionsItem>
            <NDescriptionsItem label="响应时间">
              <NTag type="warning">
                {{ activeLog.takeUpTime }}ms
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="浏览器">
              {{ activeLog.browser }}
            </NDescriptionsItem>
            <NDescriptionsItem label="访问时间">
              {{ activeLog.timestamp }}
            </NDescriptionsItem>
            <NDescriptionsItem label="链路ID">
              {{ activeLog.reqId }}
            </NDescriptionsItem>
          </NDescriptions>
          <NDescriptions v-if="activeLog" bordered style="padding-top: 20px" :column="1">
            <NDescriptionsItem label="访问代理">
              {{ activeLog.userAgent }}
            </NDescriptionsItem>
          </NDescriptions>

          <n-card
            :bordered="false"
            class="proCard mt-4"
            size="small"
            :segmented="{ content: true }"
            title="Header请求头"
          >
            <n-collapse>
              <n-collapse-item
                v-if="activeLog"
                title="点击展开/折叠请求头详情"
                name="headers"
              >
                <n-code
                  language="json"
                  :code="JSON.stringify(activeLog.headerData, null, 2)"
                  word-wrap
                />
              </n-collapse-item>
            </n-collapse>
          </n-card>

          <n-card
            :bordered="false"
            class="proCard mt-4"
            size="small"
            :segmented="{ content: true }"
            title="GET参数"
            v-if="activeLog?.method === 'GET'"
          >
            <n-collapse>
              <n-collapse-item
                v-if="activeLog"
                title="点击展开/折叠详情"
                name="get"
              >
                <n-code
                  language="json"
                  :code="JSON.stringify(activeLog.getData, null, 2)"
                  word-wrap
                />
              </n-collapse-item>
            </n-collapse>
          </n-card>

          <n-card
            v-if="activeLog?.method === 'POST'"
            :bordered="false"
            class="proCard mt-4"
            size="small"
            :segmented="{ content: true }"
            title="POST参数"
          >
            <n-collapse>
              <n-collapse-item
                v-if="activeLog"
                title="点击展开/折叠详情"
                name="post"
              >
                <n-code
                  language="json"
                  :code="JSON.stringify(activeLog.postData, null, 2)"
                  word-wrap
                />
              </n-collapse-item>
            </n-collapse>
          </n-card>

        </div>
      </NCard>
    </NSpace>
  </NFlex>
</template>

<style scoped>
</style>
