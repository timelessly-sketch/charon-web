<script setup lang="ts">
import { Login } from './components'

type IformType = 'login'
const formType: Ref<IformType> = ref('login')
const formComponets = {
  login: Login,
}

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <n-el class="wh-full flex-center" style="background-color: var(--body-color);">
    <n-el
      class="p-4xl h-full w-full sm:w-450px sm:h-700px"
      style="background: var(--card-color); box-shadow: var(--box-shadow-1);"
    >
      <div class="w-full flex flex-col items-center">
        <SvgIconsLogo class="text-4em" />
        <n-h3>{{ appName }} </n-h3>
        <transition
          name="fade-slide"
          mode="out-in"
        >
          <component
            :is="formComponets[formType]"
            v-model="formType"
            class="w-85%"
          />
        </transition>
      </div>
    </n-el>

    <div />
  </n-el>
</template>
