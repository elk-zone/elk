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
    <div flex w-fit px5 py2 md:gap2 gap4 items-center transition-100 rounded-full group-hover:bg-active group-focus-visible:ring="2 current">
      <slot name="icon">
        <div :class="icon" md:text-size-inherit text-xl />
      </slot>
      <slot>
        <span>{{ text }}</span>
      </slot>
    </div>
  </NuxtLink>
</template>
