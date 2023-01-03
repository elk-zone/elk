// @unocss-include
export const accountFieldIcons: Record<string, string> = Object.fromEntries(Object.entries({
  Alipay: 'i-ri:alipay-fill',
  Bilibili: 'i-ri:bilibili-fill',
  Birth: 'i-ri:calendar-line',
  Blog: 'i-ri:newspaper-line',
  City: 'i-ri:map-pin-2-line',
  Dingding: 'i-ri:dingding-fill',
  Discord: 'i-ri:discord-fill',
  Douban: 'i-ri:douban-fill',
  Facebook: 'i-ri:facebook-fill',
  GitHub: 'i-ri:github-fill',
  GitLab: 'i-ri:gitlab-fill',
  Home: 'i-ri:home-2-line',
  Instagram: 'i-ri:instagram-line',
  Joined: 'i-ri:user-add-line',
  Language: 'i-ri:translate-2',
  Languages: 'i-ri:translate-2',
  LinkedIn: 'i-ri:linkedin-box-fill',
  Location: 'i-ri:map-pin-2-line',
  Mastodon: 'i-ri:mastodon-line',
  Medium: 'i-ri:medium-fill',
  Patreon: 'i-ri:patreon-fill',
  PayPal: 'i-ri:paypal-fill',
  PlayStation: 'i-ri:playstation-fill',
  Portfolio: 'i-ri:link',
  QQ: 'i-ri:qq-fill',
  Site: 'i-ri:link',
  Sponsors: 'i-ri:heart-3-line',
  Spotify: 'i-ri:spotify-fill',
  Steam: 'i-ri:steam-fill',
  Switch: 'i-ri:switch-fill',
  Telegram: 'i-ri:telegram-fill',
  Tumblr: 'i-ri:tumblr-fill',
  Twitch: 'i-ri:twitch-line',
  Twitter: 'i-ri:twitter-line',
  Website: 'i-ri:link',
  WeChat: 'i-ri:wechat-fill',
  Weibo: 'i-ri:weibo-fill',
  Xbox: 'i-ri:xbox-fill',
  YouTube: 'i-ri:youtube-line',
  Zhihu: 'i-ri:zhihu-fill',
}).sort(([a], [b]) => a.localeCompare(b)))

const accountFieldIconsLowercase = Object.fromEntries(
  Object.entries(accountFieldIcons).map(([k, v]) =>
    [k.toLowerCase(), v],
  ),
)

export const getAccountFieldIcon = (value: string) => {
  const name = value.trim().toLowerCase()
  return accountFieldIconsLowercase[name] || undefined
}
