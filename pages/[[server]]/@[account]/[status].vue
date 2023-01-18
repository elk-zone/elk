<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import type { ComponentPublicInstance } from 'vue'

definePageMeta({
  name: 'status',
  key: route => route.path,
  // GoToSocial
  alias: ['/:server?/@:account/statuses/:status'],
})

const route = useRoute()
const id = $(computedEager(() => route.params.status as string))
const main = ref<ComponentPublicInstance | null>(null)

const publishWidget = ref()

const { data: status, pending, refresh: refreshStatus } = useAsyncData(
  `status:${id}`,
  () => fetchStatus(id),
  { watch: [isHydrated], immediate: isHydrated.value, default: () => shallowRef() },
)
const { client } = $(useMasto())
const { data: context, pending: pendingContext, refresh: refreshContext } = useAsyncData(
  `context:${id}`,
  async () => client.v1.statuses.fetchContext(id),
  { watch: [isHydrated], immediate: isHydrated.value, lazy: true, default: () => shallowRef() },
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

watch(publishWidget, () => {
  if (window.history.state.focusReply)
    focusEditor()
})

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refreshStatus()
  refreshContext()
})
</script>

<template>
  <MainContent back>
    <template v-if="!pending && !pendingContext">
      <div v-if="status" xl:mt-4 border="b base" mb="50vh">
        <template v-for="comment, i of context?.ancestors" :key="comment.id">
          <StatusCard
            :status="comment" :actions="comment.visibility !== 'direct'" context="account"
            :has-older="true" :newer="context?.ancestors[i - 1]"
          />
        </template>

        <StatusDetails
          ref="main"
          :status="status"
          :newer="context?.ancestors.at(-1)"
          command
          style="scroll-margin-top: 60px"
        />
        <PublishWidget
          v-if="currentUser"
          ref="publishWidget"
          border="y base"
          :draft-key="replyDraft!.key"
          :initial="replyDraft!.draft"
          @published="refreshContext()"
        />

        <TimelineSkeleton v-if="pendingContext" />
        <DynamicScroller
          v-slot="{ item, index, active }"
          :items="context?.descendants || []"
          :min-item-size="200"
          key-field="id"
          page-mode
        >
          <DynamicScrollerItem :item="item" :active="active">
            <StatusCard
              :status="item"
              context="account"
              :older="context?.descendants[index + 1]"
              :newer="index > 0 ? context?.descendants[index - 1] : status"
              :has-newer="index === 0"
              :main="status"
            />
          </DynamicScrollerItem>
        </DynamicScroller>
      </div>

      <StatusNotFound v-else :account="route.params.account as string" :status="id" />
    </template>

    <StatusCardSkeleton v-else border="b base" />
  </MainContent>
</template>
