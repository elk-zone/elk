import { createVNode, defineComponent, h, render } from 'vue'
import CommonMask from '~/components/common/CommonMask.vue'

export interface UseMaskOptions {
  getContainer?: () => HTMLElement
  background?: string
}

export function useMask(options: UseMaskOptions = {}) {
  const {
    background = 'transparent',
    getContainer = () => document.body,
  } = options
  const wrapperEl = (process.server ? null : document.createElement('div')) as HTMLDivElement
  const MaskComp = defineComponent({
    setup() {
      return () => {
        return h(CommonMask, { background })
      }
    },
  })

  function show() {
    const container = getContainer()
    container?.appendChild(wrapperEl)
    const vm = createVNode(MaskComp)
    render(vm, wrapperEl)
  }

  function hide() {
    render(null, wrapperEl)
    wrapperEl.parentNode?.removeChild(wrapperEl)
  }

  return {
    show,
    hide,
  }
}
