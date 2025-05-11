<script setup lang="ts">
import { useAuthStore } from '@/store'
import IconGithub from '~icons/icon-park-outline/github'
import IconLogout from '~icons/icon-park-outline/logout'
import IconUser from '~icons/icon-park-outline/user'

const { t } = useI18n()

const { userInfo, logout } = useAuthStore()
const router = useRouter()

const options = computed(() => {
  return [
    {
      label: t('app.user'),
      key: 'user',
      icon: () => h(IconUser),
    },
    {
      type: 'divider',
      key: 'd1',
    },
    {
      label: 'Github',
      key: 'github',
      icon: () => h(IconGithub),
    },
    {
      label: t('app.loginOut'),
      key: 'loginOut',
      icon: () => h(IconLogout),
    },
  ]
})
function handleSelect(key: string | number) {
  if (key === 'loginOut') {
    window.$dialog?.info({
      title: t('app.loginOutTitle'),
      content: t('app.loginOutContent'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        logout()
      },
    })
  }
  if (key === 'user')
    router.push('/janus/user')

  if (key === 'github')
    window.open('https://github.com/chansee97/nova-admin')
}
</script>

<template>
  <n-dropdown
    trigger="click"
    :options="options"
    @select="handleSelect"
  >
    <n-avatar
      round
      class="cursor-pointer"
      :src="userInfo?.avatar"
    >
      <template #fallback>
        <div class="wh-full flex-center">
          <icon-park-outline-user />
        </div>
      </template>
    </n-avatar>
  </n-dropdown>
</template>

<style scoped></style>
