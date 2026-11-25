import type { Dropdown, Menu, Tooltip, vClosePopper } from 'floating-vue'

declare module 'vue' {
  interface GlobalComponents {
    VDropdown: typeof Dropdown
    VMenu: typeof Menu
    VTooltip: typeof Tooltip
  }

  interface GlobalDirectives {
    vClosePopper: typeof vClosePopper
  }

  interface HTMLAttributes {
    'data-index'?: number
    'data-emoji-id'?: string
    'data-mode'?: string
  }
}

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
