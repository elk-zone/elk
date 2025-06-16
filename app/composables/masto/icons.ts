// @unocss-include
export const accountFieldIcons: Record<string, string> = Object.fromEntries(Object.entries({
  Alipay: 'i-ri:alipay-line',
  Bilibili: 'i-ri:bilibili-line',
  Birth: 'i-ri:calendar-line',
  Blog: 'i-ri:newspaper-line',
  Bluesky: 'i-ri:bluesky-line',
  City: 'i-ri:map-pin-2-line',
  Dingding: 'i-ri:dingding-line',
  Discord: 'i-ri:discord-line',
  Douban: 'i-ri:douban-line',
  Facebook: 'i-ri:facebook-line',
  Friendica: 'i-ri:friendica-line',
  GitHub: 'i-ri:github-line',
  GitLab: 'i-ri:gitlab-line',
  GPG: 'i-ri:key-2-line',
  Home: 'i-ri:home-2-line',
  Instagram: 'i-ri:instagram-line',
  Joined: 'i-ri:user-add-line',
  Keyoxide: 'i-ri:key-2-line',
  Language: 'i-ri:translate-2',
  Languages: 'i-ri:translate-2',
  LinkedIn: 'i-ri:linkedin-box-line',
  Location: 'i-ri:map-pin-2-line',
  Mastodon: 'i-ri:mastodon-line',
  Matrix: 'i-tabler:brand-matrix',
  Medium: 'i-ri:medium-line',
  OpenPGP: 'i-ri:key-2-line',
  Patreon: 'i-ri:patreon-line',
  PayPal: 'i-ri:paypal-line',
  PGP: 'i-ri:key-2-line',
  Photos: 'i-ri:camera-2-line',
  Pinterest: 'i-ri:pinterest-line',
  PlayStation: 'i-ri:playstation-line',
  Portfolio: 'i-ri:link',
  Pronouns: 'i-ri:contacts-line',
  QQ: 'i-ri:qq-line',
  Site: 'i-ri:link',
  Sponsors: 'i-ri:heart-3-line',
  Spotify: 'i-ri:spotify-line',
  Steam: 'i-ri:steam-line',
  Switch: 'i-ri:switch-line',
  Telegram: 'i-ri:telegram-line',
  Threads: 'i-ri:threads-line',
  TikTok: 'i-ri:tiktok-line',
  Tumblr: 'i-ri:tumblr-line',
  Twitch: 'i-ri:twitch-line',
  Twitter: 'i-ri:twitter-line',
  Website: 'i-ri:link',
  WeChat: 'i-ri:wechat-line',
  Weibo: 'i-ri:weibo-line',
  Xbox: 'i-ri:xbox-line',
  YouTube: 'i-ri:youtube-line',
  Zhihu: 'i-ri:zhihu-line',
}).sort(([a], [b]) => a.localeCompare(b)))

const accountFieldIconsLowercase = Object.fromEntries(
  Object.entries(accountFieldIcons).map(([k, v]) =>
    [k.toLowerCase(), v],
  ),
)

export function getAccountFieldIcon(value: string) {
  const name = value.trim().toLowerCase()
  return accountFieldIconsLowercase[name] || undefined
}

export const statusVisibilities = [
  {
    value: 'public',
    icon: 'i-ri:global-line',
  },
  {
    value: 'unlisted',
    icon: 'i-ri:moon-line',
  },
  {
    value: 'private',
    icon: 'i-ri:lock-line',
  },
  {
    value: 'direct',
    icon: 'i-ri:at-line',
  },
] as const
