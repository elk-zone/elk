<script setup lang="ts">
const props = withDefaults(defineProps<{
  text?: string
  icon: string
  to: string | Record<string, string>
  userOnly?: boolean
}>(), {
  userOnly: false,
})

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

let activeClass = $ref('text-primary')
watch(isMastoInitialised, async () => {
  if (!props.userOnly) {
    // TODO: force NuxtLink to reevaluate, we now we are in this route though, so we should force it to active
    // we don't have currentServer defined until later
    activeClass = ''
    await nextTick()
    activeClass = 'text-primary'
  }
})

// Optimize rendering for the common case of being logged in, only show visual feedback for disabled user-only items
// when we know there is no user.
const noUserDisable = computed(() => !isMastoInitialised.value || (props.userOnly && !currentUser.value))
const noUserVisual = computed(() => isMastoInitialised.value && props.userOnly && !currentUser.value)
</script>

<template>
  <NuxtLink :to="to" :disabled="noUserDisable" :class="noUserVisual ? 'op25 pointer-events-none ' : ''" :active-class="activeClass" group focus:outline-none @click="$scrollToTop">
    <CommonTooltip :disabled="!isMediumScreen" :content="text" placement="right">
      <div flex w-fit px2 mx3 lg:mx0 lg:px5 py2 gap4 items-center transition-100 rounded-full group-hover:bg-active group-focus-visible:ring="2 current">
        <slot name="icon">
          <div :class="icon" text-xl />
        </slot>
        <slot>
          <span block sm:hidden lg:block>{{ text }}</span>
        </slot>
      </div>
    </CommonTooltip>
  </NuxtLink>
</template>
