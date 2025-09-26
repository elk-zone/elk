export default defineAppConfig({
  seo: {
    title: 'Elk',
    description: 'A nimble Mastodon web client with modern features and elegant design.',
  },
  header: {
    title: 'Elk',
    logo: {
      alt: 'Elk',
      light: '/logo.svg',
      dark: '/logo.svg',
    },
  },
  socials: {
    github: 'https://github.com/elk-zone/elk',
    mastodon: 'https://elk.zone/@elk@webtoo.ls',
  },
  github: {
    url: 'https://github.com/elk-zone/elk',
    branch: 'main',
    rootDir: 'docs',
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      links: [
        {
          icon: 'i-ph-shooting-star-duotone',
          label: 'Star on GitHub',
          to: 'https://github.com/elk-zone/elk',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-mastodon',
          label: 'Follow on Mastodon',
          to: 'https://elk.zone/@elk@webtoo.ls',
          target: '_blank',
        },
      ],
    },
  },
})
