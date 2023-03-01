<script setup lang="ts">
const buildInfo = useBuildInfo()
const timeAgoOptions = useTimeAgoOptions()

const userSettings = useUserSettings()

const buildTimeDate = new Date(buildInfo.time)
const buildTimeAgo = useTimeAgo(buildTimeDate, timeAgoOptions)

const colorMode = useColorMode()
function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <CommonTooltip :content="$t('nav.toggle_theme')">
        <button flex i-ri:sun-line dark-i-ri:moon-line text-lg :aria-label="$t('nav.toggle_theme')" @click="toggleDark()" />
      </CommonTooltip>
      <CommonTooltip :content="$t('nav.zen_mode')">
        <button
          flex
          text-lg
          :class="userSettings.zenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
          :aria-label="$t('nav.zen_mode')"
          @click="userSettings.zenMode = !userSettings.zenMode"
        />
      </CommonTooltip>
      <CommonTooltip :content="$t('settings.about.sponsor_action')" />
    </div>
    <div>
      <i18n-t v-if="isHydrated" keypath="nav.built_at">
        <time :datetime="String(buildTimeDate)" :title="$d(buildTimeDate, 'long')">{{ buildTimeAgo }}</time>
      </i18n-t>
      <span v-else>
        {{ $t('nav.built_at', [$d(buildTimeDate, 'shortDate')]) }}
      </span>
      &middot;
      <NuxtLink
        v-if="buildInfo.env === 'release'"
        external
        :href="`https://github.com/elk-zone/elk/releases/tag/v${buildInfo.version}`"
        target="_blank"
        font-mono
      >
        v{{ buildInfo.version }}
      </NuxtLink>
      <span v-else>{{ buildInfo.env }}</span>
      <template v-if="buildInfo.commit && buildInfo.branch !== 'release'">
        <NuxtLink
          external
          :href="`https://github.com/elk-zone/elk/commit/${buildInfo.commit}`"
          target="_blank"
          font-mono
        >
          {{ buildInfo.shortCommit }}
        </NuxtLink>
      </template>
    </div>
    <div flex gap-2>
      <NuxtLink to="/settings/about" cursor-pointer underline>
        {{ $t('settings.about.label') }}
      </NuxtLink>
      <template v-if="$config.public.privacyPolicyUrl">
        <NuxtLink :to="$config.public.privacyPolicyUrl" cursor-pointer underline>
          {{ $t('nav.privacy') }}
        </NuxtLink>
      </template>
      <NuxtLink href="/m.webtoo.ls/@elk" target="_blank" underline>
        Mastodon
      </NuxtLink>
      <NuxtLink href="https://chat.elk.zone" target="_blank" external underline>
        Discord
      </NuxtLink>
      <NuxtLink href="https://github.com/elk-zone/elk" target="_blank" external underline>
        GitHub
      </NuxtLink>
      <NuxtLink href="https://github.com/sponsors/elk-zone" target="_blank" external whitespace-nowrap>
        <span underline>{{ $t('settings.about.sponsor_action') }}</span> &#x2665;
      </NuxtLink>
    </div>
  </footer>
</template>
