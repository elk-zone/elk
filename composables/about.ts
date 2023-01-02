export interface Team {
  github: string
  display: string
  twitter: string
  mastodon: string
}

export const teams: Team[] = [
  {
    github: 'antfu',
    display: 'Anthony Fu',
    twitter: 'antfu7',
    mastodon: 'antfu@mas.to',
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
    display: 'sxzz',
    twitter: 'sanxiaozhizi',
    mastodon: 'sxzz@mas.to',
  },
].sort(() => Math.random() - 0.5)
