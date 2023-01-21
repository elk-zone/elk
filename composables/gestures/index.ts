import type { PermissiveMotionProperties } from '@vueuse/motion'
import type { Handlers } from '@vueuse/gesture'
import { useMotionProperties, useSpring } from '@vueuse/motion'
import { useGesture } from '@vueuse/gesture'
import type { MaybeRef } from '@vueuse/core'

export const useImageGesture = (
  domTarget: MaybeRef<HTMLElement>,
) => {
  const { motionProperties } = useMotionProperties(domTarget, {
    cursor: 'grab',
    scale: 1,
    x: 0,
    y: 0,
  })

  const { set } = useSpring(motionProperties as Partial<PermissiveMotionProperties>)

  const handlers: Handlers = {
    onPinch({ offset: [d] }) {
      set({ scale: 1 + Math.max(-0.9, d / 200) })
    },
    onWheel({ event, dragging, pinching }) {
      if (!dragging && !pinching && event.altKey) {
        event.preventDefault()
        // @ts-expect-error why is ts complaining here (motionProperties.scale)?
        set({ scale: motionProperties.scale + event.deltaY * 0.001 })
      }
    },
    onDblclick() {
      set({ scale: 1 })
    },
    onTouchstart(event) {
      if (event.touches === 2)
        set({ scale: 1 })
    },
  }

  useGesture(handlers, {
    domTarget,
    eventOptions: { passive: false },
  })
}
