import { h, render } from 'vue'
import CommonMask from '~/components/common/CommonMask.vue'

export interface UseMaskOptions {
  getContainer?: () => HTMLElement
  background?: string
  zIndex?: number
}

export function useMask(options: UseMaskOptions = {}) {
  const {
    background = 'transparent',
    getContainer = () => document.body,
    zIndex = 100,
  } = options
  const wrapperEl = (import.meta.server ? null : document.createElement('div')) as HTMLDivElement

  function show() {
    const container = getContainer()
    container?.appendChild(wrapperEl)
    const MaskComp = h(CommonMask, { background, zIndex })
    render(MaskComp, wrapperEl)
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
