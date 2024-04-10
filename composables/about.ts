import type { BuildInfo } from '~~/types'

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
    github: 'patak-dev',
    display: 'Patak',
    twitter: 'patak_dev',
    mastodon: 'patak@webtoo.ls',
    link: '/m.webtoo.ls/@patak',
  },
  {
    github: 'danielroe',
    display: 'Daniel Roe',
    twitter: 'danielcroe',
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
    sponsors: 'elk-zone', // sponsors/shuuji3 isn't enabled
  },
].sort(() => Math.random() - 0.5)

export const crabTeamMembers: Team[] = [
  {
    github: 'maybeanerd',
    display: 'Basti',
    mastodon: 'maybeanerd@bumscode.com',
    link: '/bumscode.com/@maybeanerd',
  },
  {
    github: 'kriskbx',
    display: 'Kris',
    mastodon: 'kris@bumscode.com',
    link: '/bumscode.com/@kris',
  },
  {
    github: 'tiborpilz',
    display: 'Tibor',
    mastodon: 'tibor@bumscode.com',
    link: '/bumscode.com/@tibor',
  },
  {
    github: 'lostdesign',
    display: 'André',
    mastodon: 'wellerli@bumscode.com',
    link: '/bumscode.com/@wellerli',
  },
].sort(() => Math.random() - 0.5)

export function useBuildInfo() {
  return useAppConfig().buildInfo as BuildInfo
}
