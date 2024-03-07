export default defineAppConfig({
  docus: {
    title: 'crab',
    description: 'A nimble Mastodon web client.',
    image: 'https://github.com/maybeanerd/crab/blob/main/public/crab-original.png?raw=true',
    socials: {
      github: 'maybeanerd/crab',
      mastodon: {
        label: 'Mastodon',
        icon: 'IconMastodon',
        href: 'https://crab.bumscode.com/@maybeanerd',
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
          href: 'https://crab.bumscode.com/@maybeanerd',
          icon: 'IconMastodon',
        },
      ],
    },
  },
})
