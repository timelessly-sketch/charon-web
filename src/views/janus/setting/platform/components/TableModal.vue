<script setup lang="ts">
import { useBoolean } from '@/hooks'
import { fetchPlatformEdit } from '@/service'

interface Props {
  modalName?: string
}

const {
  modalName = '',
} = defineProps<Props>()

const emit = defineEmits<{
  open: []
  close: []
  update: [platform: Entity.Platform]
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const formDefault: Entity.Platform = {
  id: 0,
  platformName: '',
  platformCode: '',
  serverUrl: '',
  defaultRoute: '',
  icon: '',
  status: 1,
  platformSort: 1,
}
const formModel = ref<Entity.Platform>({ ...formDefault })

type ModalType = 'add' | 'view' | 'edit'
const modalType = shallowRef<ModalType>('add')
const modalTitle = computed(() => {
  const titleMap: Record<ModalType, string> = {
    add: '添加',
    view: '查看',
    edit: '编辑',
  }
  return `${titleMap[modalType.value]}${modalName}`
})

async function openModal(type: ModalType = 'add', data: any) {
  emit('open')
  modalType.value = type
  showModal()
  const handlers = {
    async add() {
      formModel.value = { ...formDefault }
    },
    async view() {
      if (!data)
        return
      formModel.value = { ...data }
    },
    async edit() {
      if (!data)
        return
      formModel.value = { ...data }
    },
  }
  await handlers[type]()
}

function closeModal() {
  hiddenModal()
  endLoading()
  emit('close')
}

defineExpose({
  openModal,
})

const formRef = ref()
async function submitModal() {
  const handlers = {
    async add() {
      // return new Promise((resolve) => {
      //   // fetchUserEdit(formModel.value).then((res: any) => {
      //   //   if (res.isSuccess) {
      //   //     window.$message.success('新增成功')
      //   //     resolve(true)
      //   //   }
      //   //   resolve(false)
      //   // })
      // })
    },
    async edit() {
      return new Promise((resolve) => {
        fetchPlatformEdit(formModel.value).then((res: any) => {
          if (res.isSuccess) {
            window.$message.success('编辑成功')
            resolve(true)
          }
          resolve(false)
        })
      })
    },
    async view() {
      return true
    },
  }
  await formRef.value?.validate()
  startLoading()
  await handlers[modalType.value]() && closeModal()
  emit('update', formModel.value)
  endLoading()
}

const rules = {
  nickName: { required: true, message: '请输入昵称', trigger: 'blur' },
  userName: { required: true, message: '请输入用户名', trigger: 'blur' },
  name: { required: true, message: '请输入用户姓名', trigger: 'blur' },
  userId: { required: true, message: '请输入用户ID', trigger: 'blur' },
}
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    :title="modalTitle"
    class="w-700px"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form ref="formRef" :rules="rules" label-placement="left" :model="formModel" :label-width="100" :disabled="modalType === 'view'">
      <n-grid :cols="2" :x-gap="18">
        <n-form-item-grid-item :span="2" label="平台名称" path="platformName">
          <n-input v-model:value="formModel.platformName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="平台编码" path="platformCode">
          <n-input v-model:value="formModel.platformCode" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="平台地址" path="serverUrl">
          <n-input v-model:value="formModel.serverUrl" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="默认路由" path="defaultRoute">
          <n-input v-model:value="formModel.defaultRoute" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="平台排序" path="platformSort">
          <n-input-number v-model:value="formModel.platformSort" clearable :precision="0" :min="0" :step="1" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="图标" path="icon">
          <icon-select v-model:value="formModel.icon" :disabled="modalType === 'view'" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="平台状态" path="status">
          <n-switch
            v-model:value="formModel.status"
            :checked-value="1" :unchecked-value="2"
          >
            <template #checked>
              启用
            </template>
            <template #unchecked>
              禁用
            </template>
          </n-switch>
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
    <template #action>
      <n-space justify="center">
        <n-button @click="closeModal">
          取消
        </n-button>
        <n-button type="primary" :loading="submitLoading" @click="submitModal">
          提交
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
