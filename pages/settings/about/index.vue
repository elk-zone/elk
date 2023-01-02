<script setup lang="ts">
import buildInfo from 'virtual:build-info'

let showCommit = $ref(false)
const builtTime = useFormattedDateTime(buildInfo.time)

const handleShowCommit = () => {
  setTimeout(() => {
    showCommit = true
  }, 50)
}
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.about.label') }}</span>
      </div>
    </template>

    <div flex="~ col gap4" w-full items-center justify-center my5>
      <img :alt="$t('app_logo')" src="/logo.svg" w-24 h-24 class="rtl-flip">
      <p text-lg>
        {{ $t('app_desc_short') }}
      </p>
    </div>

    <template v-if="isHydrated">
      <SettingsItem
        text="Version"
        :to="showCommit ? `https://github.com/elk-zone/elk/commit/${buildInfo.commit}` : undefined"
        external target="_blank"
        @click="handleShowCommit"
      >
        <template #content>
          <div font-mono>
            v{{ buildInfo.version }}
            <span v-if="showCommit">({{ buildInfo.commit.slice(0, 7) }})</span>
          </div>
        </template>
      </SettingsItem>

      <SettingsItem text="Built time" :content="builtTime" />
    </template>

    <div h-1px bg-border my2 />

    <SettingsItem
      :text="$t('nav.show_intro')"
      icon="i-ri:article-line"
      cursor-pointer
      @click="openPreviewHelp"
    />

    <SettingsItem
      text="Mastodon"
      icon="i-ri:mastodon-line"
      to="https://m.webtoo.ls/@elk"
      external target="_blank"
    />
    <SettingsItem
      text="Discord"
      icon="i-ri:discord-fill"
      to="https://chat.elk.zone"
      external target="_blank"
    />
    <SettingsItem
      text="GitHub"
      icon="i-ri:github-fill"
      to="https://github.com/elk-zone"
      external target="_blank"
    />

    <div h-1px bg-border my2 />

    <template v-if="isHydrated">
      <p px5 py3 font-bold text-lg>
        Meet the team
      </p>
      <SettingsItem
        v-for="team in teams" :key="team.github"
        :text="team.display"
        :to="`https://github.com/sponsors/${team.github}`"
        external target="_blank"
      >
        <template #icon>
          <img :src="`https://res.cloudinary.com/dchoja2nb/image/twitter_name/h_32,w_32/f_auto/${team.twitter}.jpg`" :alt="team.display" rounded-full w-8 h-8 height="32" width="32">
        </template>
      </SettingsItem>
    </template>
  </MainContent>
</template>
