<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const { options, command, replace } = $defineProps<{
  options: {
    to: RouteLocationRaw
    display: string
    name?: string
    icon?: string
  }[]
  command?: boolean
  replace?: boolean
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
  <div flex w-full items-center lg:text-lg>
    <RouterLink
      v-for="(option, index) in options"
      :key="option?.name || index"
      :to="option.to"
      :replace="replace"
      relative flex flex-auto cursor-pointer px3 m1 rounded transition-all
      tabindex="1"
      hover:bg-active transition-100
      exact-active-class="children:(font-bold !border-primary !op100)"
    >
      <span mxa px4 py3 text-center border-b-3 op50 hover:op70 border-transparent>{{ option.display }}</span>
    </RouterLink>
  </div>
</template>
