import type { AriaAnnounceType } from '~/composables/aria/types'

const ariaAnnouncer = useEventBus<AriaAnnounceType, string | undefined>(Symbol('aria-announcer'))

export const useAriaAnnouncer = () => {
  const announce = (message: string) => {
    ariaAnnouncer.emit('announce', message)
  }

  const announceImmediate = (message: string) => {
    ariaAnnouncer.emit('announce', message)
  }

  const mute = () => {
    ariaAnnouncer.emit('mute')
  }

  const unmute = () => {
    ariaAnnouncer.emit('unmute')
  }

  return { announce, announceImmediate, ariaAnnouncer, mute, unmute }
}

export const useAriaLog = () => {
  let logs = $ref<string[]>([])

  const announceLogs = (messages: string[]) => {
    requestAnimationFrame(() => {
      logs = messages
    })
  }

  const clearLogs = () => {
    logs = []
  }

  return {
    announceLogs,
    clearLogs,
    logs,
  }
}

export const useAriaStatus = () => {
  let status = $ref<string>('')

  const announceStatus = (message: string) => {
    requestAnimationFrame(() => {
      status = message
    })
  }

  const clearStatus = () => {
    status = ''
  }

  return {
    announceStatus,
    clearStatus,
    status,
  }
}
