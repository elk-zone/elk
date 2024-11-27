<script setup lang="ts">
const props = defineProps<{
  text?: string
  content?: string
  description?: string
  icon?: string
  to?: string | Record<string, string>
  command?: boolean
  disabled?: boolean
  external?: true
  large?: true
  match?: boolean
  target?: string
}>()

const router = useRouter()
const scrollOnClick = computed(() => props.to && !(props.target === '_blank' || props.external))

useCommand({
  scope: 'Settings',

  name: () => props.text
    ?? (props.to
      ? typeof props.to === 'string'
        ? props.to
        : props.to.name
      : ''
    ),
  description: () => props.description,
  icon: () => props.icon || '',
  visible: () => props.command && props.to,

  onActivate() {
    router.push(props.to!)
  },
})
</script>

<template>
  <NuxtLink
    :disabled="disabled"
    :to="to"
    :external="external"
    :target="target"
    exact-active-class="text-primary"
    :class="disabled ? 'op25 pointer-events-none ' : match ? 'text-primary' : ''"
    block w-full group focus:outline-none
    :tabindex="disabled ? -1 : null"
    @click="scrollOnClick ? $scrollToTop() : undefined"
  >
    <div
      w-full flex px5 py3 md:gap2 gap4 items-center
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
            <div
              v-if="icon"
              :class="[icon, large ? 'text-xl mr-1' : 'text-xl md:text-size-inherit']"
            />
          </slot>
        </div>
        <div flex="~ col gap-0.5">
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
      <div v-if="to" :class="!external ? 'i-ri:arrow-right-s-line' : 'i-ri:external-link-line'" text-xl text-secondary-light class="rtl-flip" />
    </div>
  </NuxtLink>
</template>
