import * as log from 'tauri-plugin-log-api'

// When running inside Tauri, catch all logs from 3rd party packages and direct them to the unified logging stream
export default defineNuxtPlugin(() => {
  // eslint-disable-next-line no-global-assign
  console = {
    ...console,
    trace: log.trace,
    debug: log.debug,
    log: log.info,
    warn: log.warn,
    error: log.error,
  }

  window.addEventListener('unhandledrejection', err =>
    log.error(err.reason))
  window.addEventListener('error', err => log.error(err.error), true)
})
