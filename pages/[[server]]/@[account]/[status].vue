<script setup lang="ts">
import type { Status } from 'masto'
import type { ComponentPublicInstance } from 'vue'

definePageMeta({
  name: 'status',
  key: route => route.path,
})

const route = useRoute()
const id = $(computedEager(() => route.params.status as string))
const main = ref<ComponentPublicInstance | null>(null)
const entries = ref<HTMLDivElement | null>(null)
let bottomSpace = $ref(0)
const publishWidget = ref()

const { data: status, pending, refresh: refreshStatus } = useAsyncData(
  `status:${id}`,
  () => fetchStatus(id),
  { watch: [isMastoInitialised], immediate: isMastoInitialised.value },
)
const masto = useMasto()
const { data: context, pending: pendingContext, refresh: refreshContext } = useAsyncData(`context:${id}`, () => masto.statuses.fetchContext(id))

const replyDraft = $computed(() => status.value ? getReplyDraft(status.value) : null)

function scrollTo() {
  const statusElement = unrefElement(main)
  if (!statusElement)
    return

  calcBottomSpace()

  statusElement.scrollIntoView(true)

  if (context.value?.ancestors.length) {
    // If there are entries above statusElement, adjusts scroll position by 4
    // pixels to match statusElement position before entries were loaded
    requestAnimationFrame(() => (window.scrollBy(0, 4)))
  }
}

function calcBottomSpace() {
  const entryElements = entries.value?.querySelectorAll('.entryCard')
  const lastEntry = entryElements?.length ? entryElements[entryElements.length - 1] : undefined
  const lastEntryHeight = lastEntry?.getBoundingClientRect().height ?? 0

  bottomSpace = (window?.innerHeight ?? 0) - lastEntryHeight

  if (!context.value?.descendants.length) {
    // Will prevent overscroll if vieing only one entry
    const publishElement = unrefElement(publishWidget)
    bottomSpace = bottomSpace - (publishElement?.getBoundingClientRect()?.height ?? 0)
  }
}

onMounted(scrollTo)

if (pendingContext) {
  watchOnce(pendingContext, async () => {
    await nextTick()
    scrollTo()
  })
}

const focusEditor = () => {
  publishWidget.value?.focusEditor?.()
}

provide('focus-editor', focusEditor)

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refreshStatus()
  refreshContext()
})

const spacerStyle = $computed(() => {
  if (isMobileScreen.value)
    return { minHeight: '3.5rem', height: `calc(${bottomSpace + 1}px - 7.5rem + 2px)` }

  return { minHeight: '25vh', height: `calc(${bottomSpace + 1}px - 4rem + 2px)` }
})
</script>

<template>
  <MainContent back>
    <template v-if="!pending">
      <div v-if="status" mt--1px>
        <div ref="entries">
          <template v-for="comment of context?.ancestors" :key="comment.id">
            <StatusCard
              class="entryCard"
              :status="comment" :actions="comment.visibility !== 'direct'" context="account"
              :has-older="true" :has-newer="true"
            />
          </template>

          <StatusDetails
            ref="main"
            class="entryCard"
            :status="status"
            command
            style="scroll-margin-top: 60px"
            :actions="status.visibility !== 'direct'"
          />
          <PublishWidget
            v-if="currentUser"
            ref="publishWidget"
            border="y base"
            :draft-key="replyDraft!.key"
            :initial="replyDraft!.draft"
            @published="refreshContext()"
          />

          <template v-for="(comment, di) of context?.descendants" :key="comment.id">
            <StatusCard
              class="entryCard"
              :status="comment" :actions="comment.visibility !== 'direct'" context="account"
              :older="context?.descendants[di + 1]" :newer="context?.descendants[di - 1]" :has-newer="di === 0" :main="status"
            />
          </template>
        </div>
        <div :style="spacerStyle" />
      </div>

      <StatusNotFound v-else :account="route.params.account" :status="id" />
    </template>

    <StatusCardSkeleton v-else border="b base" />
  </MainContent>
</template>
