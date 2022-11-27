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
    mastodon: 'patak@mas.to',
  },
  {
    github: 'danielroe',
    display: 'Daniel Roe',
    twitter: 'danielcroe',
    mastodon: 'daniel@daniel.roe',
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
  <div p8 flex="~ col gap-4" relative max-h-screen of-auto>
    <button btn-action-icon absolute top-0 right-0 m1 @click="emit('close')">
      <div i-ri:close-fill />
    </button>

    <img src="/logo.svg" w-20 h-20 mxa alt="logo">
    <h1 mxa text-4xl mb4>
      Elk is in Preview!
    </h1>
    <p>
      Thank you for interested in trying out Elk, our working in progress generic Mastodon client!
    </p>
    <p>
      <b text-primary>You shall expect to see some features missing or some bugs here and there.</b>
      We are working hard to make develop and improve it.
      And we will soon invite you to join the force once we make it open source soon!
    </p>
    <p>
      Before that, to help boosting out development, you can sponsor our team members with the links below.
    </p>
    <p flex="~ gap-2 wrap" mxa>
      <template v-for="team of teams" :key="team.github">
        <a :href="`https://github.com/sponsors/${team.github}`" target="_blank" rounded-full>
          <img :src="`https://github.com/${team.github}.png`" :alt="team.display" rounded-full w-15 h-15>
        </a>
      </template>
    </p>
    <p italic text-2xl>
      <span text-lg font-script>The Elk Team</span>
    </p>

    <button btn-solid mxa @click="emit('close')">
      Enter App
    </button>
  </div>
</template>
