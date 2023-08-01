<script lang="ts" setup>
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

export interface Props {
  /**
   * level of depth
   *
   * @default 100
   */
  zIndex?: number

  /**
   * whether to allow close dialog by clicking mask layer
   *
   * @default true
   */
  closeByMask?: boolean

  /**
   * use v-if, destroy all the internal elements after closed
   *
   * @default true
   */
  useVIf?: boolean

  /**
   * keep the dialog opened even when in other views
   *
   * @default false
   */
  keepAlive?: boolean

  /**
   * The aria-labelledby id for the dialog.
   */
  dialogLabelledBy?: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  zIndex: 100,
  closeByMask: true,
  useVIf: true,
  keepAlive: false,
})

const emit = defineEmits<{
  /** v-model dialog visibility */
  (event: 'close'): void
}>()

const visible = defineModel<boolean>({ required: true })

const deactivated = useDeactivated()
const route = useRoute()

/** scrollable HTML element */
const elDialogMain = ref<HTMLDivElement>()
const elDialogRoot = ref<HTMLDivElement>()

const { activate } = useFocusTrap(elDialogRoot, {
  immediate: false,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
  preventScroll: true,
  returnFocusOnDeactivate: true,
})

defineExpose({
  elDialogRoot,
  elDialogMain,
})

/** close the dialog */
function close() {
  if (!visible.value)
    return
  visible.value = false
  emit('close')
}

function clickMask() {
  if (props.closeByMask)
    close()
}

const routePath = ref(route.path)
watch(visible, (value) => {
  if (value)
    routePath.value = route.path
})

const notInCurrentPage = computed(() => deactivated.value || routePath.value !== route.path)
watch(notInCurrentPage, (value) => {
  if (props.keepAlive)
    return
  if (value)
    close()
})

// controls the state of v-if.
// when useVIf is toggled, v-if has the same state as modelValue, otherwise v-if is true
const isVIf = computed(() => {
  return props.useVIf
    ? visible.value
    : true
})

// controls the state of v-show.
// when useVIf is toggled, v-show is true, otherwise it has the same state as modelValue
const isVShow = computed(() => {
  return !props.useVIf
    ? visible.value
    : true
})

function bindTypeToAny($attrs: any) {
  return $attrs as any
}

function trapFocusDialog() {
  if (isVShow.value)
    nextTick().then(() => activate())
}

useEventListener('keydown', (e: KeyboardEvent) => {
  if (!visible.value)
    return
  if (e.key === 'Escape') {
    close()
    e.preventDefault()
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Dialog component -->
    <Transition name="dialog-visible" @transitionend="trapFocusDialog">
      <div
        v-if="isVIf"
        v-show="isVShow"
        ref="elDialogRoot"
        aria-modal="true"
        :aria-labelledby="dialogLabelledBy"
        :style="{
          'z-index': zIndex,
        }"
        fixed inset-0 of-y-auto scrollbar-hide overscroll-none
      >
        <!-- The style `scrollbar-hide overscroll-none overflow-y-scroll` and `h="[calc(100%+0.5px)]"` is used to implement scroll locking, -->
        <!-- corresponding to issue: #106, so please don't remove it. -->

        <!-- Mask layer: blur -->
        <div class="dialog-mask" absolute inset-0 z-0 bg-transparent opacity-100 backdrop-filter backdrop-blur-sm touch-none />
        <!-- Mask layer: dimming -->
        <div class="dialog-mask" absolute inset-0 z-0 bg-black opacity-48 touch-none h="[calc(100%+0.5px)]" @click="clickMask" />
        <!-- Dialog container -->
        <div class="p-safe-area" absolute inset-0 z-1 pointer-events-none opacity-100 flex>
          <div flex-1 flex items-center justify-center p-4>
            <!-- We use `class` here to make v-bind being able to be override them -->
            <div
              ref="elDialogMain"
              class="dialog-main rounded shadow-lg pointer-events-auto isolate bg-base border-base border-1px border-solid w-full max-h-full of-y-auto overscroll-contain touch-pan-y touch-pan-x"
              v-bind="bindTypeToAny($attrs)"
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.dialog-visible-enter-active,
.dialog-visible-leave-active {
  transition-duration: 0.25s;

  .dialog-mask {
    transition: opacity 0.25s ease;
  }

  .dialog-main {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
}

.dialog-visible-enter-from,
.dialog-visible-leave-to {
  .dialog-mask {
    opacity: 0;
  }

  .dialog-main {
    transform: translateY(50px);
    opacity: 0;
  }
}

.p-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
</style>
