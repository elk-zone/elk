export default defineAppConfig({
  docus: {
    title: 'Elk',
    description: 'A nimble Mastodon web client.',
    image: 'https://docs.elk.zone/elk-screenshot.png',
    socials: {
      // twitter: 'elk_zone',
      github: 'elk-zone/elk',
      mastodon: {
        label: 'Mastodon',
        icon: 'IconMastodon',
        href: 'https://elk.zone/@elk@webtoo.ls',
      },
    },
    aside: {
      level: 0,
      exclude: [],
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
    },
    footer: {
      iconLinks: [
        {
          href: 'https://nuxt.com',
          icon: 'IconNuxtLabs',
        },
        {
          href: 'https://m.webtoo.ls/@elk',
          icon: 'IconMastodon',
        },
      ],
    },
  },
})
