<script setup lang="ts">
import { useAuthStore } from '@/store'
import type { UploadFileInfo } from 'naive-ui'
import { fetchResetPass } from '@/service'

const authStore = useAuthStore()
const { userInfo } = authStore
const showPasswordModal = ref(false)

async function beforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (data.file.file?.type !== 'image/png') {
    window.$message.warning('只能上传png格式的图片文件，请重新上传')
    return false
  }
  return true
}
const newPassword = ref('')

async function resetPwd() {
  if (!userInfo?.id) {
    window.$message.error('用户信息无效')
    return
  }

  const params = {
    id: userInfo.id,
    password: newPassword.value,
  }

  const { isSuccess } = await fetchResetPass(params)

  if (isSuccess) {
    window.$message?.success('重置成功')
    showPasswordModal.value = false
    newPassword.value = ''
    await authStore.logout()
  }
}
</script>

<template>
  <div>
    <n-space vertical>
      <n-card title="基本信息">
        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <n-avatar round :size="100" :src="userInfo?.avatar" />
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              style="width: 100%; text-align: center;"
              @before-upload="beforeUpload"
            >
              <n-button size="small">
                修改头像
              </n-button>
            </n-upload>
          </div>
          <n-descriptions label-placement="left" :column="1">
            <n-descriptions-item label="昵称">
              {{ userInfo?.nickname }}
            </n-descriptions-item>
            <n-descriptions-item label="用户名">
              {{ userInfo?.username }}
            </n-descriptions-item>
            <n-descriptions-item label="真实名称">
              {{ userInfo?.name }}
            </n-descriptions-item>
            <n-descriptions-item label="角色">
              {{ userInfo?.role }}
            </n-descriptions-item>
          </n-descriptions>
        </div>
      </n-card>
      <n-card title="安全设置">
        <n-descriptions label-placement="left" separator="">
          <n-descriptions-item label="">
            <span style="margin-right: 12px;">即时更新密码，帐号更安全</span>
            <n-button
              size="small"
              type="primary"
              text
              @click="showPasswordModal = true"
            >
              修改密码
            </n-button>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-space>
    <n-modal v-model:show="showPasswordModal" style="width: 600px">
      <n-card title="修改密码">
        <n-space vertical>
          <n-input v-model:value="newPassword" type="password" placeholder="请输入新密码" />
          <div style="float: right; margin-top: 5px">
            <n-button type="success" @click="resetPwd">
              确认
            </n-button>
            <n-button type="success" style="margin-left: 10px" @click="showPasswordModal = false">
              取消
            </n-button>
          </div>
        </n-space>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped></style>
