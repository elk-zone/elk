<script setup lang="ts">
const props = defineProps<{
  text?: string
  icon: string
  to: string | Record<string, string>
}>()

defineSlots<{
  icon: {}
  default: {}
}>()

const router = useRouter()

useCommand({
  scope: 'Navigation',

  name: () => props.text ?? (typeof props.to === 'string' ? props.to as string : props.to.name),
  icon: () => props.icon,

  onActivate() {
    router.push(props.to)
  },
})
</script>

<template>
  <NuxtLink :to="to" :active-class="isMastoInitialised ? 'text-primary' : ''" group focus:outline-none @click="$scrollToTop">
    <CommonTooltip :disabled="!isMediumScreen" :content="text" placement="right">
      <div flex w-fit px2 mx3 lg:mx0 lg:px5 py2 gap4 items-center transition-100 rounded-full group-hover:bg-active group-focus-visible:ring="2 current">
        <slot name="icon">
          <div :class="icon" text-xl />
        </slot>
        <slot>
          <span hidden lg:block>{{ text }}</span>
        </slot>
      </div>
    </CommonTooltip>
  </NuxtLink>
</template>
