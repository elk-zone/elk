<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export interface CommonRouteTabOption {
  to: RouteLocationRaw
  display: string
  disabled?: boolean
  name?: string
  icon?: string
}
const { options, command, replace, preventScrollTop = false } = $defineProps<{
  options: CommonRouteTabOption[]
  command?: boolean
  replace?: boolean
  preventScrollTop?: boolean
}>()

const router = useRouter()

useCommands(() => command
  ? options.map(tab => ({
    scope: 'Tabs',

    name: tab.display,
    icon: tab.icon ?? 'i-ri:file-list-2-line',
    onActivate: () => router.replace(tab.to),
  }))
  : [])
</script>

<template>
  <div flex w-full items-center lg:text-lg of-x-auto scrollbar-hide border="b base">
    <template
      v-for="(option, index) in options"
      :key="option?.name || index"
    >
      <NuxtLink
        v-if="!option.disabled"
        :to="option.to"
        :replace="replace"
        relative flex flex-auto cursor-pointer sm:px6 px2 rounded transition-all
        tabindex="1"
        hover:bg-active transition-100
        exact-active-class="children:(text-secondary !border-primary !op100 !text-base)"
        @click="!preventScrollTop && $scrollToTop()"
      >
        <span ws-nowrap mxa sm:px2 sm:py3 xl:pb4 xl:pt5 py2 text-center border-b-3 text-secondary-light hover:text-secondary border-transparent>{{ option.display || '&nbsp;' }}</span>
      </NuxtLink>
      <div v-else flex flex-auto sm:px6 px2 xl:pb4 xl:pt5>
        <span ws-nowrap mxa sm:px2 sm:py3 py2 text-center text-secondary-light op50>{{ option.display }}</span>
      </div>
    </template>
  </div>
</template>
