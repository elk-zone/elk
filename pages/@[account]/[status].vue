<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const route = useRoute()
const id = $computed(() => route.params.status as string)
const main = ref<ComponentPublicInstance | null>(null)
let bottomSpace = $ref(0)

const status = window.history.state?.status ?? await fetchStatus(id)
const { data: context, pending } = useAsyncData(`context:${id}`, () => useMasto().statuses.fetchContext(id))

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
        border="t base"
        :draft-key="`reply-${id}`"
        :placeholder="`Reply to ${status?.account ? getDisplayName(status.account) : 'this thread'}`"
        :in-reply-to-id="id"
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
