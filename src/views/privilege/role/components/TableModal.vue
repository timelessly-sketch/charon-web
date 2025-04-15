<script setup lang="ts">
import type {
  FormItemRule,
} from 'naive-ui'
import { Regex } from '@/constants'
import { useBoolean } from '@/hooks'
import { fetchRoleEdit } from '@/service/api/privilege'

interface Props {
  modalName?: string
  allRoles: Entity.AuthRole[]
}

const {
  modalName = '',
} = defineProps<Props>()

const emit = defineEmits<{
  open: []
  close: []
  update: [router: Entity.AuthRole]
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const formDefault: Entity.AuthRole = {
  id: 0,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 0,
  platformCode: '',
}
const formModel = ref<Entity.AuthRole>({ ...formDefault })

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

async function openModal(type: ModalType = 'add', data: Entity.AuthRole, platformCode: string) {
  emit('open')
  modalType.value = type
  showModal()
  const handlers = {
    async add() {
      formModel.value = { ...formDefault }
      formModel.value.platformCode = platformCode
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
      return new Promise((resolve) => {
        fetchRoleEdit(formModel.value).then((res: any) => {
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
        fetchRoleEdit(formModel.value).then((res: any) => {
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
  name: {
    required: true,
    // message: '请输入菜单名称',
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('请输入菜单名称')

      if (!new RegExp(Regex.RouteName).test(value))
        return new Error('菜单只能包含英文数字_!@#$%^&*~-')

      return true
    },
    trigger: 'blur',
  },
  path: {
    required: true,
    message: '请输入菜单路径',
    trigger: 'blur',
  },
  componentPath: {
    required: true,
    message: '请输入组件路径',
    trigger: 'blur',
  },
  title: {
    required: true,
    message: '请输入菜单标题',
    trigger: 'blur',
  },
}
</script>

<template>
  <n-modal
    v-model:show="modalVisible" :mask-closable="false" preset="card" :title="modalTitle" class="w-700px"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form
      ref="formRef"
      :rules="rules" label-placement="left" :label-width="100"
      :model="formModel"
      :disabled="modalType === 'view'"
    >
      <n-grid :cols="2" :x-gap="18">
        <n-form-item-grid-item :span="2" label="角色名称" path="roleName">
          <n-input v-model:value="formModel.roleName" placeholder="请输入角色名称" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="角色编码" path="roleKey">
          <n-input v-model:value="formModel.roleKey" placeholder="请输入角色编码" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="角色排序" path="roleSort">
          <n-input-number v-model:value="formModel.roleSort" clearable :precision="0" :min="1" :step="1" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="2" label="角色状态" path="status">
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
    <template v-if="modalType !== 'view'" #action>
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

<style scoped></style>
