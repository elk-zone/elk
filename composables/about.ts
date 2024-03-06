import type { BuildInfo } from '~~/types'

export interface Team {
  github: string
  display: string
  twitter?: string
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

export const crabTeamMembers: Team[] = [
  {
    github: 'maybeanerd',
    display: 'Basti',
    mastodon: 'maybeanerd@bumscode.com',
  },
  {
    github: 'kriskbx',
    display: 'Kris',
    mastodon: 'kris@bumscode.com',
  },
  {
    github: 'tiborpilz',
    display: 'Tibor',
    mastodon: 'tibor@bumscode.com',
  }, {
    github: 'lostdesign',
    display: 'André',
    mastodon: 'wellerli@bumscode.com',
  },
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
