<script setup lang="ts">
import type { Status } from 'masto'
import type { ComponentPublicInstance } from 'vue'

const route = useRoute()
const id = $(computedEager(() => route.params.status as string))
const main = ref<ComponentPublicInstance | null>(null)
let bottomSpace = $ref(0)

const { data: status, refresh: refreshStatus } = useAsyncData(async () => (
  window.history.state?.status as Status | undefined)
  ?? await fetchStatus(id),
)
const { data: context, pending, refresh: refreshContext } = useAsyncData(`context:${id}`, () => useMasto().statuses.fetchContext(id))

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

if (pending) {
  watchOnce(pending, async () => {
    await nextTick()
    scrollTo()
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refreshStatus()
  refreshContext()
})
</script>

<template>
  <MainContent back>
    <div v-if="status" min-h-100vh>
      <template v-if="context">
        <template v-for="comment of context?.ancestors" :key="comment.id">
          <StatusCard :status="comment" border="t base" py3 />
        </template>
      </template>

      <StatusDetails
        ref="main"
        :status="status"
        border="t base"
        style="scroll-margin-top: 60px"
      />
      <PublishWidget
        v-if="currentUser"
        :draft-key="replyDraft!.key"
        :initial="replyDraft!.draft"
        border="t base"
      />

      <template v-if="context">
        <template v-for="comment of context?.descendants" :key="comment.id">
          <StatusCard :status="comment" border="t base" py3 />
        </template>
      </template>

      <div border="t base" :style="{ height: `${bottomSpace}px` }" />
    </div>

    <CommonNotFound v-else>
      Status not found
    </CommonNotFound>
  </MainContent>
</template>
