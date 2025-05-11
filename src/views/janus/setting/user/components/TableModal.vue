<script setup lang="ts">
import { useBoolean } from '@/hooks'
import { fetchUserDetail, fetchUserEdit } from '@/service'
import { transformToCascader } from '@/utils/roleUtils'

interface Props {
  modalName?: string
}

const {
  modalName = '',
} = defineProps<Props>()

const emit = defineEmits<{
  open: []
  close: []
  update: [user: Entity.User]
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const formDefault: Entity.User = {
  id: 0,
  username: '',
  name: '',
  email: '',
  nickname: '',
  phone: '',
  roleIds: [],
  status: 1,
  userId: '',
  remark: '',
}
const formModel = ref<Entity.User>({ ...formDefault })

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
      await getUserDetail(0)
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
      await getUserDetail(data.id)
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
      return new Promise((resolve) => {
        fetchUserEdit(formModel.value).then((res: any) => {
          if (res.isSuccess) {
            window.$message.success('新增成功')
            resolve(true)
          }
          resolve(false)
        })
      })
    },
    async edit() {
      return new Promise((resolve) => {
        fetchUserEdit(formModel.value).then((res: any) => {
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

const treeOptions = ref<Entity.CascaderNode[]>([])
async function getUserDetail(id: number) {
  startLoading()
  const { data } = await fetchUserDetail(id)
  treeOptions.value = transformToCascader(data.roles)
  formModel.value.roleIds = data.roleIds
  endLoading()
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
        <n-form-item-grid-item :span="1" label="昵称" path="nickName">
          <n-input v-model:value="formModel.nickname" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="用户名" path="userName">
          <n-input v-model:value="formModel.username" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="用户姓名" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="用户ID" path="userId">
          <n-input v-model:value="formModel.userId" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="邮箱" path="email">
          <n-input v-model:value="formModel.email" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="电话" path="phone">
          <n-input v-model:value="formModel.phone" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="角色" path="roleName">
          <n-cascader
            v-model:value="formModel.roleIds"
            :options="treeOptions"
            check-strategy="child"
            :show-path="false"
            clearable
            multiple
            placeholder="请选择角色"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="备注" path="remark">
          <n-input v-model:value="formModel.remark" type="textarea" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="用户状态" path="status">
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
