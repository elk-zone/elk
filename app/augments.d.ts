export {}

declare module '#app' {
  interface PageMeta {
    wideLayout?: boolean
  }

  interface RuntimeNuxtHooks {
    'elk-logo:click': () => void
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
