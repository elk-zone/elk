<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export interface CommonRouteTabOption {
  to: RouteLocationRaw
  display: string
  disabled?: boolean
  name?: string
  icon?: string
  hide?: boolean
}
export interface CommonRouteTabMoreOption {
  options: CommonRouteTabOption[]
  icon?: string
  tooltip?: string
}
const { options, command, replace, preventScrollTop = false, moreOptions } = $defineProps<{
  options: CommonRouteTabOption[]
  moreOptions?: CommonRouteTabMoreOption
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
      v-for="(option, index) in options.filter(item => !item.hide)"
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
    <template v-if="moreOptions && moreOptions.options?.length > 0">
      <CommonDropdown placement="bottom" flex cursor-pointer>
        <CommonTooltip placement="top" :content="moreOptions.tooltip">
          <button cursor-pointer flex gap-1 w-12 rounded hover:bg-active btn-action-icon op75 px4 group aria-label="More actions">
            <div v-if="moreOptions.icon" :class="moreOptions.icon" text-sm text-secondary me--1 />
            <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
          </button>
        </CommonTooltip>
        <template #popper>
          <NuxtLink
            v-for="(option, index) in moreOptions.options.filter(item => !item.hide)"
            :key="option?.name || index"
            :to="option.to"
          >
            <CommonDropdownItem>
              {{ option.display }}
            </CommonDropdownItem>
          </NuxtLink>
        </template>
      </commondropdown>
    </template>
  </div>
</template>
