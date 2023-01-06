<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

definePageMeta({
  name: 'status',
  key: route => route.path,
})

const route = useRoute()
const id = $(computedEager(() => route.params.status as string))
const main = ref<ComponentPublicInstance | null>(null)

const publishWidget = ref()

const { data: status, pending, refresh: refreshStatus } = useAsyncData(
  `status:${id}`,
  () => fetchStatus(id),
  { watch: [isMastoInitialised], immediate: isMastoInitialised.value },
)
const masto = useMasto()
const { data: context, pending: pendingContext, refresh: refreshContext } = useAsyncData(
  `context:${id}`,
  async () => masto.statuses.fetchContext(id),
  { watch: [isMastoInitialised], immediate: isMastoInitialised.value },
)

const replyDraft = $computed(() => status.value ? getReplyDraft(status.value) : null)

function scrollTo() {
  const statusElement = unrefElement(main)
  if (!statusElement)
    return

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
      <div v-if="status" xl:mt-4 border="b base" mb="50vh">
        <template v-for="comment of context?.ancestors" :key="comment.id">
          <StatusCard
            :status="comment" :actions="comment.visibility !== 'direct'" context="account"
            :has-older="true" :has-newer="true"
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
          v-if="!isGuest"
          ref="publishWidget"
          border="y base"
          :draft-key="replyDraft!.key"
          :initial="replyDraft!.draft"
          @published="refreshContext()"
        />

        <template v-for="(comment, di) of context?.descendants" :key="comment.id">
          <StatusCard
            :status="comment" :actions="comment.visibility !== 'direct'" context="account"
            :older="context?.descendants[di + 1]" :newer="context?.descendants[di - 1]" :has-newer="di === 0" :main="status"
          />
        </template>
      </div>

      <StatusNotFound v-else :account="route.params.account as string" :status="id" />
    </template>

    <StatusCardSkeleton v-else border="b base" />
  </MainContent>
</template>
