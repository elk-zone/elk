import type { BuildInfo } from '~~/types'

export interface Team {
  github: string
  display: string
  twitter?: string
  mastodon: string
  sponsors?: string
}

export const elkTeamMembers: Team[] = [
  {
    github: 'antfu',
    display: 'Anthony Fu',
    twitter: 'antfu7',
    mastodon: 'antfu@webtoo.ls',
  },
  {
    github: 'patak-dev',
    display: 'Patak',
    twitter: 'patak_dev',
    mastodon: 'patak@webtoo.ls',
  },
  {
    github: 'danielroe',
    display: 'Daniel Roe',
    twitter: 'danielcroe',
    mastodon: 'daniel@roe.dev',
  },
  {
    github: 'sxzz',
    display: '三咲智子 Kevin Deng',
    twitter: 'sanxiaozhizi',
    mastodon: 'sxzz@webtoo.ls',
  },
  {
    github: 'userquin',
    display: 'Joaquín Sánchez',
    twitter: 'userquin',
    mastodon: 'userquin@webtoo.ls',
    sponsors: 'elk-zone', // sponsors/userquin isn't enabled
  },
  {
    github: 'shuuji3',
    display: 'TAKAHASHI Shuuji',
    mastodon: 'shuuji3@webtoo.ls',
    sponsors: 'elk-zone', // sponsors/shuuji3 isn't enabled
  },
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
