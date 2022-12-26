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
let bottomSpace = $ref(0)
const publishWidget = ref()

const { data: status, pending, refresh: refreshStatus } = useAsyncData(
  `status:${id}`,
  async () => (window.history.state?.status as Status | undefined) ?? await fetchStatus(id),
  { watch: [isMastoInitialised], immediate: isMastoInitialised.value },
)
const masto = useMasto()
const { data: context, pending: pendingContext, refresh: refreshContext } = useAsyncData(`context:${id}`, () => masto.statuses.fetchContext(id))

const replyDraft = $computed(() => status.value ? getReplyDraft(status.value) : null)

function scrollTo() {
  const statusElement = unrefElement(main)
  if (!statusElement)
    return

  const statusRect = statusElement.getBoundingClientRect()
  bottomSpace = window.innerHeight - statusRect.height
  statusElement.scrollIntoView(true)
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
</script>

<template>
  <MainContent back>
    <template v-if="!pending">
      <div v-if="status" min-h-100vh mt--1px>
        <template v-for="comment of context?.ancestors" :key="comment.id">
          <StatusCard
            :status="comment" :actions="comment.visibility !== 'direct'" context="account"
            :show-reply-to="false" :connect-reply="true"
          />
        </template>

        <StatusDetails
          ref="main"
          :status="status"
          command
          style="scroll-margin-top: 60px"
          :actions="status.visibility !== 'direct'"
        />
        <PublishWidget
          v-if="currentUser"
          ref="publishWidget"
          :draft-key="replyDraft!.key"
          :initial="replyDraft!.draft"
          @published="refreshContext()"
        />

        <template v-for="comment, di of context?.descendants" :key="comment.id">
          <StatusCard
            :status="comment" :actions="comment.visibility !== 'direct'" context="account"
            :connect-reply="comment.id === context?.descendants[di + 1]?.inReplyToId"
            :show-reply-to="di !== 0 && comment.inReplyToId !== context?.descendants[di - 1]?.id"
            :class="{ 'border-t border-base': di !== 0 && comment.inReplyToId !== context?.descendants[di - 1]?.id }"
          />
        </template>

        <div :style="{ height: `${bottomSpace}px` }" />
      </div>

      <StatusNotFound v-else :account="$route.params.account" :status="id" />
    </template>

    <StatusCardSkeleton v-else border="b base" />
  </MainContent>
</template>
