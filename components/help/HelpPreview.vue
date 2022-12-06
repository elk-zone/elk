<script setup lang="ts">
interface Team {
  github: string
  display: string
  twitter: string
  mastodon: string
}

const emit = defineEmits<{
  (event: 'close'): void
}>()

const teams: Team[] = [
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
    twitter: 'sxzz',
    mastodon: 'sxzz@mas.to',
  },
].sort(() => Math.random() - 0.5)
</script>

<template>
  <div my-8 px-3 sm:px-8 md:max-w-200 flex="~ col gap-4" relative>
    <button btn-action-icon absolute top--8 right-0 m1 aria-label="Close" @click="emit('close')">
      <div i-ri:close-fill />
    </button>

    <img src="/logo.svg" w-20 h-20 mxa alt="logo">
    <h1 mxa text-4xl mb4>
      {{ $t('help.title') }}
    </h1>
    <p>
      {{ $t('help.desc_para1') }}
    </p>
    <p>
      <b text-primary>{{ $t('help.desc_highlight') }}</b>
      {{ $t('help.desc_para2') }}
    </p>
    {{ $t('help.desc_para3') }}
    <p flex="~ gap-2 wrap" mxa>
      <template v-for="team of teams" :key="team.github">
        <a :href="`https://github.com/sponsors/${team.github}`" target="_blank" rounded-full>
          <img :src="`https://res.cloudinary.com/dchoja2nb/image/twitter_name/h_120,w_120/f_auto/${team.twitter}.jpg`" :alt="team.display" rounded-full w-15 h-15 height="60" width="60">
        </a>
      </template>
    </p>
    <p italic text-2xl>
      <span text-lg font-script>The Elk Team</span>
    </p>

    <button btn-solid mxa @click="emit('close')">
      {{ $t('action.enter_app') }}
    </button>
  </div>
</template>
