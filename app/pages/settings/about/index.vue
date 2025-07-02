<script setup lang="ts">
const buildInfo = useBuildInfo()
const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.about.label')} | ${t('nav.settings')}`,
})

const showCommit = ref(buildInfo.env !== 'release' && buildInfo.env !== 'dev')
const builtTime = useFormattedDateTime(buildInfo.time)

function handleShowCommit() {
  setTimeout(() => {
    showCommit.value = true
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
      <img :alt="$t('app_logo')" :src="`${''}/logo.svg`" w-24 h-24 class="rtl-flip">
      <p text-lg>
        {{ $t('app_desc_short') }}
      </p>
    </div>

    <template v-if="isHydrated">
      <SettingsItem
        :text="$t('settings.about.version')"
        :to="showCommit ? `https://github.com/elk-zone/elk/commit/${buildInfo.commit}` : undefined"
        external target="_blank"
        @click="handleShowCommit"
      >
        <template #content>
          <div font-mono>
            <span>{{ buildInfo.env === 'release' ? `v${buildInfo.version}` : buildInfo.env }}</span>
            <span v-if="showCommit"> ({{ buildInfo.shortCommit }}@{{ buildInfo.branch }})</span>
          </div>
        </template>
      </SettingsItem>

      <SettingsItem :text="$t('settings.about.built_at')" :content="builtTime" />
    </template>

    <div h-1px bg-border my2 />

    <SettingsItem
      :text="$t('nav.show_intro')"
      icon="i-ri:article-line"
      cursor-pointer large
      @click="openPreviewHelp"
    />

    <SettingsItem
      :text="$t('nav.docs')"
      icon="i-ri:book-open-line"
      to="https://docs.elk.zone/"
      large target="_blank"
    />

    <SettingsItem
      text="Mastodon"
      icon="i-ri:mastodon-line"
      to="/m.webtoo.ls/@elk"
      large target="_blank"
    />
    <SettingsItem
      text="Discord"
      icon="i-ri:discord-fill"
      to="https://chat.elk.zone"
      external large target="_blank"
    />
    <SettingsItem
      text="GitHub"
      icon="i-ri:github-fill"
      to="https://github.com/elk-zone/elk"
      external large target="_blank"
    />

    <div h-1px bg-border my2 />

    <p px5 py3 font-bold text-lg>
      {{ $t('settings.about.sponsors') }}
    </p>

    <p px5 text-secondary>
      {{ $t('settings.about.sponsors_body_1') }}
    </p>

    <LazySettingsSponsorsList />

    <p px5 mb1 text-secondary>
      {{ $t('settings.about.sponsors_body_2') }}
    </p>
    <p px5 mb2 text-secondary>
      {{ $t('settings.about.sponsors_body_3') }}
    </p>

    <SettingsItem
      :text="$t('settings.about.sponsor_action')"
      to="https://github.com/sponsors/elk-zone"
      :description="$t('settings.about.sponsor_action_desc')"
      external large target="_blank"
    >
      <template #icon>
        <div i-ri-heart-3-fill text-rose rounded-full w-8 h-8 height="32" width="32" />
      </template>
    </SettingsItem>

    <div h-1px bg-border my2 />

    <template v-if="isHydrated">
      <p px5 py3 font-bold text-lg>
        {{ $t('settings.about.meet_the_team') }}
      </p>

      <SettingsItem
        v-for="team in elkTeamMembers" :key="team.github"
        :text="team.display"
        :to="team.link"
        external target="_blank"
      >
        <template #icon>
          <img :src="`/avatars/${team.github}-60x60.png`" :alt="team.display" rounded-full w-8 h-8 height="32" width="32">
        </template>
      </SettingsItem>
    </template>
  </MainContent>
</template>
