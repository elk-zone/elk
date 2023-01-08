export const APP_NAME = 'Elk'

export const DEFAULT_POST_CHARS_LIMIT = 500
export const DEFAULT_FONT_SIZE = 'md'

export const STORAGE_KEY_DRAFTS = 'elk-drafts'
export const STORAGE_KEY_USERS = 'elk-users'
export const STORAGE_KEY_SERVERS = 'elk-servers'
export const STORAGE_KEY_CURRENT_USER = 'elk-current-user'
export const STORAGE_KEY_NOTIFY_TAB = 'elk-notify-tab'
export const STORAGE_KEY_FIRST_VISIT = 'elk-first-visit'
export const STORAGE_KEY_SETTINGS = 'elk-settings'
export const STORAGE_KEY_CUSTOM_EMOJIS = 'elk-custom-emojis'
export const STORAGE_KEY_HIDE_EXPLORE_POSTS_TIPS = 'elk-hide-explore-posts-tips'
export const STORAGE_KEY_HIDE_EXPLORE_NEWS_TIPS = 'elk-hide-explore-news-tips'
export const STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS = 'elk-hide-explore-tags-tips'
export const STORAGE_KEY_NOTIFICATION = 'elk-notification'
export const STORAGE_KEY_NOTIFICATION_POLICY = 'elk-notification-policy'
export const STORAGE_KEY_LAST_SCROLL_POSITION = 'elk-last-scroll-position'

export const COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60 * 1000

export const COOKIE_KEY_FONT_SIZE = 'elk-font-size'
export const COOKIE_KEY_COLOR_MODE = 'elk-color-mode'
export const COOKIE_KEY_LOCALE = 'elk-lang'

export const HANDLED_MASTO_URLS = /^(https?:\/\/)?([\w\d-]+\.)+\w+\/(@[@\w\d-\.]+)(\/objects)?(\/\d+)?$/
