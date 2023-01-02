<script lang="ts" setup>
const props = defineProps<{
  text?: string
  description?: string
  icon?: string
  to: string | Record<string, string>
  command?: boolean
}>()

const router = useRouter()

useCommand({
  scope: 'Settings',

  name: () => props.text ?? (typeof props.to === 'string' ? props.to as string : props.to.name),
  description: () => props.description,
  icon: () => props.icon || '',
  visible: () => props.command,

  onActivate() {
    router.push(props.to)
  },
})
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
        <div
          flex items-center justify-center flex-shrink-0
          :class="$slots.description ? 'w-12 h-12' : ''"
        >
          <slot name="icon">
            <div v-if="icon" :class="icon" md:text-size-inherit text-xl />
          </slot>
        </div>
        <div space-y-1>
          <p>
            <slot>
              <span>{{ text }}</span>
            </slot>
          </p>
          <p v-if="$slots.description" text-sm text-secondary>
            <slot name="description">
              {{ description }}
            </slot>
          </p>
        </div>
      </div>
      <div i-ri:arrow-right-s-line text-xl text-secondary-light class="rtl-flip" />
    </div>
  </NuxtLink>
</template>
