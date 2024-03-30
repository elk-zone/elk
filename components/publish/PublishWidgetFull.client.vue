<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'

const route = useRoute()
const { formatNumber } = useHumanReadableNumber()
const timeAgoOptions = useTimeAgoOptions()

const draftKey = ref('home')

const draftKeys = computed(() => Object.keys(currentUserDrafts.value))
const nonEmptyDrafts = computed(() => draftKeys.value
  .filter(i => i !== draftKey.value && !isEmptyDraft(currentUserDrafts.value[i]))
  .map(i => [i, currentUserDrafts.value[i]] as const),
)

watchEffect(() => {
  draftKey.value = route.query.draft?.toString() || 'home'
})

onDeactivated(() => {
  clearEmptyDrafts()
})
</script>

<template>
  <div flex="~ col" pt-6 h-screen>
    <div inline-flex justify-end h-8>
      <VDropdown v-if="nonEmptyDrafts.length" placement="bottom-end">
        <button btn-text flex="inline center">
          {{ $t('compose.drafts', nonEmptyDrafts.length, { named: { v: formatNumber(nonEmptyDrafts.length) } }) }}&#160;
          <div aria-hidden="true" i-ri:arrow-down-s-line />
        </button>
        <template #popper="{ hide }">
          <div flex="~ col">
            <NuxtLink
              v-for="[key, draft] of nonEmptyDrafts" :key="key" border="b base" text-left py2 px4
              hover:bg-active :replace="true" :to="`/compose?draft=${encodeURIComponent(key)}`" @click="hide()"
            >
              <div>
                <div flex="~ gap-1" items-center>
                  <i18n-t keypath="compose.draft_title">
                    <!-- TODO localize -->
                    <code>{{ key }}{{ draft.length > 1 ? ' (Thread)' : '' }}</code>
                  </i18n-t>
                  <span v-if="draft[0].lastUpdated" text-secondary text-sm>
                    &middot; {{ formatTimeAgo(new Date(draft[0].lastUpdated), timeAgoOptions) }}
                  </span>
                </div>
                <div text-secondary>
                  {{ htmlToText(draft[0].params.status).slice(0, 50) }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </VDropdown>
    </div>
    <div>
      <PublishWidgetList expanded class="min-h-100!" :draft-key="draftKey" />
    </div>
  </div>
</template>
