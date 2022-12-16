import type { AriaAnnounceType } from '~/composables/aria/types'

const ariaAnnouncer = useEventBus<AriaAnnounceType, string | undefined>(Symbol('aria-announcer'))

export const useAriaAnnouncer = () => {
  const announce = (message: string) => {
    ariaAnnouncer.emit('announce', message)
  }

  const mute = () => {
    ariaAnnouncer.emit('mute')
  }

  const unmute = () => {
    ariaAnnouncer.emit('unmute')
  }

  return { announce, ariaAnnouncer, mute, unmute }
}

export const useAriaLog = () => {
  let logs = $ref<any[]>([])

  const announceLogs = (messages: any[]) => {
    requestAnimationFrame(() => {
      logs = messages
    })
  }

  const appendLogs = (messages: any[]) => {
    requestAnimationFrame(() => {
      logs = logs.concat(messages)
    })
  }

  const clearLogs = () => {
    logs = []
  }

  return {
    announceLogs,
    appendLogs,
    clearLogs,
    logs,
  }
}

export const useAriaStatus = () => {
  let status = $ref<any>('')

  const announceStatus = (message: any) => {
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
