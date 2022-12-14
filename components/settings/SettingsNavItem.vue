<script lang="ts" setup>
const props = defineProps<{
  text?: string
  icon?: string
  to: string | Record<string, string>
  command?: boolean
}>()

const router = useRouter()

if (props.command) {
  useCommand({
    scope: 'Settings',

    name: () => props.text ?? (typeof props.to === 'string' ? props.to as string : props.to.name),
    icon: () => props.icon || '',

    onActivate() {
      router.push(props.to)
    },
  })
}
</script>

<template>
  <NuxtLink
    :to="to"
    exact-active-class="text-primary"
    block w-full group focus:outline-none
    @click="$scrollToTop"
  >
    <div
      w-full flex w-fit px5 py3 md:gap2 gap4 items-center
      transition-250 group-hover:bg-active
      group-focus-visible:ring="2 current"
    >
      <div flex-1 flex items-center md:gap2 gap4>
        <div v-if="icon" :class="icon" md:text-size-inherit text-xl />
        <slot>
          <span>{{ text }}</span>
        </slot>
      </div>
      <div i-ri:arrow-right-s-line text-xl text-secondary-light />
    </div>
  </NuxtLink>
</template>
