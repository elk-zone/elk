// @unocss-include
export const accountFieldIcons: Record<string, string> = Object.fromEntries(Object.entries({
  Alipay: 'i-ri:alipay-line',
  Bilibili: 'i-ri:bilibili-line',
  Birth: 'i-ri:cake-2-line',
  Birthday: 'i-ri:cake-2-line',
  Blog: 'i-ri:article-line',
  BuyMeACoffee: 'i-ri:cup-line',
  'Buy Me A Coffee': 'i-ri:cup-line',
  Chat: 'i-ri:chat-1-line',
  City: 'i-ri:map-pin-2-line',
  Dingding: 'i-ri:dingding-line',
  Discord: 'i-ri:discord-line',
  Douban: 'i-ri:douban-line',
  Email: 'i-ri:mail-line',
  'E-mail': 'i-ri:mail-line',
  Facebook: 'i-ri:facebook-circle-line',
  GitHub: 'i-ri:github-line',
  GitLab: 'i-ri:gitlab-line',
  GPG: 'i-ri:key-2-line',
  Home: 'i-ri:home-8-line',
  'Home Page': 'i-ri:home-8-line',
  Homepage: 'i-ri:home-8-line',
  Instagram: 'i-ri:instagram-line',
  IRC: 'i-ri:chat-1-line',
  Joined: 'i-ri:calendar-line',
  Keyoxide: 'i-ri:key-2-line',
  KoFi: 'i-ri:cup-line',
  'Ko-Fi': 'i-ri:cup-line',
  Language: 'i-ri:translate-2',
  Languages: 'i-ri:translate-2',
  LinkedIn: 'i-ri:linkedin-box-line',
  Location: 'i-ri:map-pin-2-line',
  Mastodon: 'i-ri:mastodon-line',
  Matrix: 'i-tabler:brand-matrix',
  Meatspace: 'i-ri:map-pin-2-line',
  Medium: 'i-ri:medium-line',
  'Nintendo Switch': 'i-ri:switch-line',
  OpenPGP: 'i-ri:key-2-line',
  Patreon: 'i-ri:patreon-line',
  PayPal: 'i-ri:paypal-line',
  PGP: 'i-ri:key-2-line',
  Photos: 'i-ri:camera-2-line',
  PlayStation: 'i-ri:playstation-line',
  Portfolio: 'i-ri:link',
  Pronouns: 'i-ri:contacts-line',
  QQ: 'i-ri:qq-line',
  Site: 'i-ri:link',
  Skype: 'i-ri:skype-line',
  Slack: 'i-ri:slack-line',
  Snapchat: 'i-ri:snapchat-line',
  Sponsors: 'i-ri:heart-3-line',
  Spotify: 'i-ri:spotify-line',
  Steam: 'i-ri:steam-line',
  Substack: 'i-ri:bookmark-line',
  Switch: 'i-ri:switch-line',
  Telegram: 'i-ri:telegram-line',
  Tumblr: 'i-ri:tumblr-fill',
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

export const getAccountFieldIcon = (value: string) => {
  const name = value.trim().toLowerCase().replace(/:$/, '')
  return accountFieldIconsLowercase[name] || undefined
}

export const statusVisibilities = [
  {
    value: 'public',
    icon: 'i-ri:global-line',
  },
  {
    value: 'unlisted',
    icon: 'i-ri:lock-unlock-line',
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
