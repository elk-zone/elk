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
  icon: (props: object) => void
  default: (props: object) => void
}>()

const router = useRouter()

useCommand({
  scope: 'Navigation',

  name: () => props.text ?? (typeof props.to === 'string' ? props.to as string : props.to.name),
  icon: () => props.icon,
  visible: () => props.command,

  onActivate() {
    router.push(props.to)
  },
})

const activeClass = ref('text-primary')
onHydrated(async () => {
  // TODO: force NuxtLink to reevaluate, we now we are in this route though, so we should force it to active
  // we don't have currentServer defined until later
  activeClass.value = ''
  await nextTick()
  activeClass.value = 'text-primary'
})

// Optimize rendering for the common case of being logged in, only show visual feedback for disabled user-only items
// when we know there is no user.
const noUserDisable = computed(() => !isHydrated.value || (props.userOnly && !currentUser.value))
const noUserVisual = computed(() => isHydrated.value && props.userOnly && !currentUser.value)
</script>

<template>
  <NuxtLink
    :to="to"
    :disabled="noUserDisable"
    :class="noUserVisual ? 'op25 pointer-events-none ' : ''"
    :active-class="activeClass"
    group focus:outline-none disabled:pointer-events-none
    :tabindex="noUserDisable ? -1 : null"
    @click="$scrollToTop"
  >
    <CommonTooltip :disabled="!isMediumOrLargeScreen" :content="text" placement="right">
      <div
        class="item"
        flex items-center gap4
        xl="ml0 mr5 px5 w-auto"
        :class="isSmallScreen
          ? `
            w-full
            px5 sm:mxa
            transition-colors duration-200 transform
            hover-bg-gray-100 hover-dark:(bg-gray-700 text-white)
          ` : `
            w-fit rounded-3
            px2 mx3 sm:mxa
            transition-100
            elk-group-hover-bg-active
            group-focus-visible:ring-2
            group-focus-visible:ring-current
          `"
      >
        <slot name="icon">
          <div :class="icon" text-xl />
        </slot>
        <slot>
          <span block sm:hidden xl:block select-none>{{ isHydrated ? text : '&nbsp;' }}</span>
        </slot>
      </div>
    </CommonTooltip>
  </NuxtLink>
</template>

<style scoped>
  .item {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  @media screen and ( max-height: 820px ) and ( min-width: 1280px ) {
    .item {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
  @media screen and ( max-height: 780px ) and ( min-width: 640px ) {
    .item {
      padding-top: 0.35rem;
      padding-bottom: 0.35rem;
    }
  }
  @media screen and ( max-height: 780px ) and ( min-width: 1280px ) {
    .item {
      padding-top: 0.05rem;
      padding-bottom: 0.05rem;
    }
  }
</style>
