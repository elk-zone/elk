<script setup lang="ts">
import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from '#i18n'
import { isRtlText } from '~/utils/rtl-text-detection'

definePageMeta({
  name: 'tag',
})

const params = useRoute().params
// TODO: change this when i18n updated to 8.0.0 (not rc)
const i18n = useNuxtApp().vueApp.config.globalProperties.$i18n as VueI18n
const tagName = $(computedEager(() => params.tag as string))
const isRtlLocale = $(computedEager(() => (i18n.locales as LocaleObject[]).find(l => l.code === i18n.locale)?.dir === 'rtl'))
const isRtlTag = $(computedEager(() => isRtlText(tagName)))

const dir = $(computedEager(() => {
  return isRtlLocale
    ? isRtlTag ? undefined : 'ltr'
    : isRtlTag ? 'rtl' : undefined
}))

const { client } = $(useMasto())
const { data: tag, refresh } = $(await useAsyncData(() => client.v1.tags.fetch(tagName), { default: () => shallowRef() }))

const paginator = client.v1.timelines.listHashtag(tagName)
const stream = useStreaming(client => client.v1.stream.streamTagTimeline(tagName))

if (tag) {
  useHydratedHead({
    title: () => `#${tag.name}`,
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span :dir="dir" text-lg font-bold>#{{ tagName }}</span>
    </template>

    <template #actions>
      <template v-if="typeof tag?.following === 'boolean'">
        <TagActionButton :tag="tag" @change="refresh()" />
      </template>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
