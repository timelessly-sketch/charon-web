<script setup lang="ts">
import type {
  FormItemRule,
} from 'naive-ui'
import HelpInfo from '@/components/common/HelpInfo.vue'
import { Regex } from '@/constants'
import { useBoolean } from '@/hooks'
import { fetchApiEdit } from '@/service/api/privilege'

interface Props {
  modalName?: string
  allApis: AppRoute.Api[]
}

const {
  modalName = '',
  allApis,
} = defineProps<Props>()

const emit = defineEmits<{
  open: []
  close: []
  update: [router: AppRoute.Api]
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const formDefault: AppRoute.Api = {
  name: '',
  path: '',
  id: 0,
  pid: 0,
  title: '',
  apiType: 'dir',
  method: '',
  icon: '',
  platformCode: '',
}
const apiMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const

const formModel = ref<AppRoute.Api>({ ...formDefault })

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

async function openModal(type: ModalType = 'add', data: AppRoute.Api, platformCode: string) {
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
        fetchApiEdit(formModel.value).then((res: any) => {
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
        fetchApiEdit(formModel.value).then((res: any) => {
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

const dirTreeOptions = computed(() => {
  return filterDirectory(JSON.parse(JSON.stringify(allApis)))
})

function filterDirectory(node: any[]) {
  return node.filter((item) => {
    if (item.children) {
      const childDir = filterDirectory(item.children)
      if (childDir.length > 0)
        item.children = childDir
      else
        Reflect.deleteProperty(item, 'children')
    }

    return (item.apiType === 'dir')
  })
}

const rules = {
  name: {
    required: true,
    // message: '请输入菜单名称',
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('请输入接口名称')

      if (!new RegExp(Regex.RouteName).test(value))
        return new Error('接口只能包含英文数字_!@#$%^&*~-')

      return true
    },
    trigger: 'blur',
  },
  path: {
    required: true,
    message: '请输入接口路径',
    trigger: 'blur',
  },
  title: {
    required: true,
    message: '请输入接口标题',
    trigger: 'blur',
  },
  method: {
    validator(rule: FormItemRule, value: string) {
      if (formModel.value.apiType === 'api' && !value) {
        return new Error('请选择接口方法')
      }
      return true
    },
    trigger: 'change',
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
        <n-form-item-grid-item :span="2" path="pid">
          <template #label>
            父级目录
            <HelpInfo message="不填写则为顶层菜单" />
          </template>
          <n-tree-select
            v-model:value="formModel.pid" filterable clearable :options="dirTreeOptions" key-field="id"
            label-field="title" children-field="children" placeholder="请选择父级目录"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="接口名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="Eg: system" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="标题" path="title">
          <n-input v-model:value="formModel.title" placeholder="Eg: My-System" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="接口类型" path="menuType">
          <n-radio-group v-model:value="formModel.apiType" name="radiogroup">
            <n-space>
              <n-radio value="dir">
                目录
              </n-radio>
              <n-radio value="api">
                接口
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="图标" path="icon">
          <icon-select v-model:value="formModel.icon" :disabled="modalType === 'view'" />
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="formModel.apiType === 'api'" span="2" label="接口方法" path="method">
          <n-radio-group v-model:value="formModel.method">
            <n-space>
              <n-radio v-for="v in apiMethod" :key="v" :value="v">
                {{ v }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="formModel.apiType === 'api'" :span="2" label="接口路径" path="path">
          <n-input v-model:value="formModel.path" placeholder="Eg: /system/user/list" />
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
