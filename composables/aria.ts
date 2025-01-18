export type AriaLive = 'off' | 'polite' | 'assertive'
export type AriaAnnounceType = 'announce' | 'mute' | 'unmute'

const ariaAnnouncer = useEventBus<AriaAnnounceType, string | undefined>(Symbol('aria-announcer'))

export function useAriaAnnouncer() {
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

export function useAriaLog() {
  const logs = ref<any[]>([])

  const announceLogs = (messages: any[]) => {
    logs.value = messages
  }

  const appendLogs = (messages: any[]) => {
    logs.value = logs.value.concat(messages)
  }

  const clearLogs = () => {
    logs.value = []
  }

  return {
    announceLogs,
    appendLogs,
    clearLogs,
    logs,
  }
}

export function useAriaStatus() {
  const status = ref<any>('')

  const announceStatus = (message: any) => {
    status.value = message
  }

  const clearStatus = () => {
    status.value = ''
  }

  return {
    announceStatus,
    clearStatus,
    status,
  }
}
