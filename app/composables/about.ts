import type { BuildInfo } from '#shared/types'

export interface Team {
  github: string
  display: string
  twitter?: string
  mastodon: string
  link: string
  sponsors?: string
}

export const elkTeamMembers: Team[] = [
  {
    github: 'antfu',
    display: 'Anthony Fu',
    twitter: 'antfu7',
    mastodon: 'antfu@webtoo.ls',
    link: '/m.webtoo.ls/@antfu',
  },
  {
    github: 'patak-cat',
    display: 'Patak',
    mastodon: 'patak@webtoo.ls',
    link: '/m.webtoo.ls/@patak',
  },
  {
    github: 'danielroe',
    display: 'Daniel Roe',
    mastodon: 'daniel@roe.dev',
    link: '/mastodon.roe.dev/@daniel',
  },
  {
    github: 'sxzz',
    display: '三咲智子 Kevin Deng',
    twitter: 'sanxiaozhizi',
    mastodon: 'sxzz@webtoo.ls',
    link: '/m.webtoo.ls/@sxzz',
  },
  {
    github: 'userquin',
    display: 'Joaquín Sánchez',
    twitter: 'userquin',
    mastodon: 'userquin@webtoo.ls',
    link: '/m.webtoo.ls/@userquin',
    sponsors: 'elk-zone', // sponsors/userquin isn't enabled
  },
  {
    github: 'shuuji3',
    display: 'TAKAHASHI Shuuji',
    mastodon: 'shuuji3@webtoo.ls',
    link: '/m.webtoo.ls/@shuuji3',
  },
  {
    github: 'ayo-run',
    display: 'ayo',
    mastodon: 'ayo@ayco.io',
    link: '/social.ayco.io/@ayo',
    sponsors: 'elk-zone', // sponsors/ayo-run isn't enabled
  },
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
