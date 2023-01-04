<script lang="ts" setup>
const props = defineProps<{
  text?: string
  content?: string
  description?: string
  icon?: string
  to?: string
  command?: boolean
}>()

const router = useRouter()

useCommand({
  scope: 'Settings',

  name: () => props.text ?? props.to ?? '',
  description: () => props.description,
  icon: () => props.icon || '',
  visible: () => props.command && props.to,

  onActivate() {
    router.push(props.to!)
  },
})
</script>

<template>
  <a
    :href="to"
    block w-full group focus:outline-none
    @click="to ? $scrollToTop() : undefined"
  >
    <div
      w-full flex w-fit px5 py3 md:gap2 gap4 items-center
      transition-250 group-hover:bg-active
      group-focus-visible:ring="2 current"
    >
      <div flex-1 flex items-center md:gap2 gap4>
        <div
          v-if="$slots.icon || icon"
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
          <p v-if="$slots.description || description" text-sm text-secondary>
            <slot name="description">
              {{ description }}
            </slot>
          </p>
        </div>
      </div>
      <p v-if="$slots.content || content" text-sm text-secondary>
        <slot name="content">
          {{ content }}
        </slot>
      </p>
      <div v-if="to" i-ri:arrow-right-s-line text-xl text-secondary-light class="rtl-flip" />
    </div>
  </a>
</template>
