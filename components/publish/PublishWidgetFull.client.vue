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
          {{ $t('compose.drafts', nonEmptyDrafts.length, { named: { v: formatNumber(nonEmptyDrafts.length) } }) }}&#160;<div aria-hidden="true" i-ri:arrow-down-s-line />
        </button>
        <template #popper="{ hide }">
          <div flex="~ col">
            <NuxtLink
              v-for="[key, draft] of nonEmptyDrafts" :key="key"
              border="b base" text-left py2 px4 hover:bg-active
              :replace="true"
              :to="`/compose?draft=${encodeURIComponent(key)}`"
              @click="hide()"
            >
              <div>
                <div flex="~ gap-1" items-center>
                  <i18n-t keypath="compose.draft_title">
                    <code>{{ key }}</code>
                  </i18n-t>
                  <span v-if="draft.lastUpdated" text-secondary text-sm>
                    &middot; {{ formatTimeAgo(new Date(draft.lastUpdated), timeAgoOptions) }}
                  </span>
                </div>
                <div text-secondary>
                  {{ htmlToText(draft.params.status).slice(0, 50) }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </VDropdown>
    </div>
    <div>
      <PublishWidget :key="draftKey" expanded class="min-h-100!" :draft-key="draftKey" />
    </div>
  </div>
</template>
