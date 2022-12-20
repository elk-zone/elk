<script setup lang="ts">
import type { Status } from 'masto/fetch'
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

const { data: status, pending, refresh: refreshStatus } = useAsyncData(`status:${id}`, async () => (
  window.history.state?.status as Status | undefined)
  ?? await fetchStatus(id),
)
const { data: context, pending: pendingContext, refresh: refreshContext } = useAsyncData(`context:${id}`, () => useMasto().statuses.fetchContext(id))

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
      <div v-if="status" min-h-100vh>
        <template v-if="context">
          <template v-for="comment of context?.ancestors" :key="comment.id">
            <StatusCard :status="comment" context="account" border="t base" :show-reply-to="false" />
          </template>
        </template>

        <StatusDetails
          ref="main"
          :status="status"
          command
          border="t base"
          style="scroll-margin-top: 60px"
        />
        <PublishWidget
          v-if="currentUser"
          ref="publishWidget"
          :draft-key="replyDraft!.key"
          :initial="replyDraft!.draft"
          border="t base"
          @published="refreshContext()"
        />

        <template v-if="context">
          <template v-for="comment of context?.descendants" :key="comment.id">
            <StatusCard :status="comment" context="account" border="t base" />
          </template>
        </template>

        <div border="t base" :style="{ height: `${bottomSpace}px` }" />
      </div>

      <StatusNotFound v-else :account="$route.params.account" :status="id" />
    </template>

    <StatusCardSkeleton v-else border="b base" />
  </MainContent>
</template>
