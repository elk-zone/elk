<script setup lang="ts">
const props = withDefaults(defineProps<{
  text?: string
  icon: string
  to: string | Record<string, string>
  userOnly?: boolean
  command?: boolean
}>(), {
  userOnly: false,
})

defineSlots<{
  icon: {}
  default: {}
}>()

const router = useRouter()
const nuxtApp = useNuxtApp()

useCommand({
  scope: 'Navigation',

  name: () => props.text ?? (typeof props.to === 'string' ? props.to as string : props.to.name),
  icon: () => props.icon,
  visible: () => props.command,

  onActivate() {
    router.push(props.to)
  },
})

let activeClass = $ref('text-primary')
onMastoInit(async () => {
  // TODO: force NuxtLink to reevaluate, we now we are in this route though, so we should force it to active
  // we don't have currentServer defined until later
  activeClass = ''
  await nextTick()
  activeClass = 'text-primary'
})

// Optimize rendering for the common case of being logged in, only show visual feedback for disabled user-only items
// when we know there is no user.
const noUserDisable = computed(() => !isMastoInitialised.value || (props.userOnly && !currentUser.value))
const noUserVisual = computed(() => isMastoInitialised.value && props.userOnly && !currentUser.value)

const handleClick = () => {
  if (nuxtApp.$preventScrollToTop(router.resolve(props.to).fullPath))
    return

  nuxtApp.$scrollToTop()
}
</script>

<template>
  <NuxtLink
    :to="to"
    :disabled="noUserDisable"
    :class="noUserVisual ? 'op25 pointer-events-none ' : ''"
    :active-class="activeClass"
    group focus:outline-none disabled:pointer-events-none
    :tabindex="noUserDisable ? -1 : null"
    @click="handleClick"
  >
    <CommonTooltip :disabled="!isMediumScreen" :content="text" placement="right">
      <div
        flex items-center gap4
        w-fit rounded-3
        px2 py2 mx3 sm:mxa
        xl="ml0 mr5 px5 w-auto"
        transition-100
        group-hover="bg-active" group-focus-visible:ring="2 current"
      >
        <slot name="icon">
          <div :class="icon" text-xl />
        </slot>
        <slot>
          <span block sm:hidden xl:block>{{ text }}</span>
        </slot>
      </div>
    </CommonTooltip>
  </NuxtLink>
</template>
