import type { BuildInfo } from '~~/types'

export interface Team {
  github: string
  display: string
  twitter: string
  mastodon: string
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
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
