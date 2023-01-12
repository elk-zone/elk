<script setup lang="ts">
import type { mastodon } from 'masto'
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.interface.label')} | ${t('nav.settings')}`,
})

const loremStatus = computed(() => {
  if (currentUser.value) {
    const loremStatus: mastodon.v1.Status = {
      account: currentUser.value!.account,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lobortis justo ut dapibus pretium. In vitae massa pulvinar, auctor ipsum nec, mattis massa. Praesent convallis.',
      emojis: currentCustomEmojis.value.emojis,
      id: '0',
      favouritesCount: 0,
      repliesCount: 0,
      reblogsCount: 0,
      sensitive: false,
      uri: '',
      application: { name: 'Elk' },
      createdAt: '2021-01-01T00:00:00.000Z',
      editedAt: null,
      visibility: 'public',
      mentions: [],
      tags: [],
      mediaAttachments: [],
      spoilerText: '',
    }

    return loremStatus
  }
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.interface.label') }}</span>
      </div>
    </template>
    <div p6 flex="~ col gap6">
      <div v-if="loremStatus" border="~ base rounded" bg-active>
        <StatusCard :status="loremStatus" />
      </div>

      <label space-y-2>
        <p font-medium>{{ $t('settings.interface.font_size') }}</p>
        <SettingsFontSize select-settings />
      </label>
      <div space-y-2>
        <p font-medium>
          {{ $t('settings.interface.color_mode') }}
        </p>
        <SettingsColorMode />
      </div>
    </div>
  </MainContent>
</template>
