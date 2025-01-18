import type { mastodon } from 'masto'

export const APP_NAME = 'Elk'

export const DEFAULT_POST_CHARS_LIMIT = 500
export const DEFAULT_FONT_SIZE = '15px'

export const ELK_PAGE_LIFECYCLE_FROZEN = 'elk-frozen'

export const STORAGE_KEY_DRAFTS = 'elk-drafts'
export const STORAGE_KEY_USERS = 'elk-users'
export const STORAGE_KEY_SERVERS = 'elk-servers'
export const STORAGE_KEY_NODES = 'elk-nodes'
export const STORAGE_KEY_CURRENT_USER_HANDLE = 'elk-current-user-handle'
export const STORAGE_KEY_NOTIFY_TAB = 'elk-notify-tab'
export const STORAGE_KEY_FIRST_VISIT = 'elk-first-visit'
export const STORAGE_KEY_SETTINGS = 'elk-settings'
export const STORAGE_KEY_CUSTOM_EMOJIS = 'elk-custom-emojis'
export const STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS = 'elk-hide-explore-posts-tips'
export const STORAGE_KEY_HIDE_EXPLORE_NEWS_TIPS = 'elk-hide-explore-news-tips'
export const STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS = 'elk-hide-explore-tags-tips'
export const STORAGE_KEY_NOTIFICATION = 'elk-notification'
export const STORAGE_KEY_NOTIFICATION_POLICY = 'elk-notification-policy'
export const STORAGE_KEY_PWA_HIDE_INSTALL = 'elk-pwa-hide-install'
export const STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE = 'elk-last-accessed-notification-route'
export const STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE = 'elk-last-accessed-explore-route'
export const STORAGE_KEY_BOTTOM_NAV_BUTTONS = 'elk-bottom-nav-buttons'

export const HANDLED_MASTO_URLS = /^(https?:\/\/)?([\w\-]+\.)+\w+\/(@[@\w\-.]+)(\/objects)?(\/\d+)?$/

export const NOTIFICATION_FILTER_TYPES: mastodon.v1.NotificationType[] = ['status', 'reblog', 'follow', 'follow_request', 'favourite', 'poll', 'update', 'admin.sign_up', 'admin.report']

export const THEME_COLORS = {
  defaultTheme: '#cc7d24',
  themeDark: '#111111',
  themeLight: '#fafafa',
  backgroundDark: '#fafafa',
  backgroundLight: '#111111',
} as const
