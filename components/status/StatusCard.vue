<script setup lang="ts">
import type { Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    hover?: boolean
  }>(),
  { actions: true },
)

const status = $computed(() => {
  if (props.status.reblog && !props.status.content)
    return props.status.reblog
  return props.status
})

const rebloggedBy = $computed(() => props.status.reblog ? props.status.account : null)

const el = ref<HTMLElement>()
const router = useRouter()

function onclick(e: MouseEvent | KeyboardEvent) {
  const path = e.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  if (!el)
    go()
}

function go() {
  cacheStatus(status)
  router.push(getStatusPath(status))
}

const createdAt = useFormattedDateTime(status.createdAt)
const timeago = useTimeAgo(() => status.createdAt, timeAgoOptions)
</script>

<template>
  <div ref="el" flex flex-col gap-2 px-4 transition-100 :class="{ 'hover:bg-active': hover }" tabindex="0" focus:outline-none focus-visible:ring="2 primary" @click="onclick" @keydown.enter="onclick">
    <div v-if="rebloggedBy" pl8>
      <div flex="~ wrap" gap-1 items-center text-gray:75 text-sm>
        <div i-ri:repeat-fill mr-1 />
        <AccountInlineInfo font-bold :account="rebloggedBy" />
        reblogged
      </div>
    </div>
    <div flex gap-4>
      <AccountAvatar w-12 h-12 :account="status.account" hover />
      <div flex="~ col 1" min-w-0>
        <div flex>
          <StatusAccountDetails :account="status.account" />
          <div flex-auto />
          <div text-sm op50 flex="~ row nowrap" hover:underline>
            <CommonTooltip :content="createdAt">
              <a :title="status.createdAt" :href="getStatusPath(status)" @click.prevent="go">
                <time text-sm op50 hover:underline :datetime="status.createdAt">
                  {{ timeago }}
                </time>
              </a>
            </CommonTooltip>
            <StatusEditIndicator :status="status" inline />
          </div>
        </div>
        <StatusReplyingTo v-if="status.inReplyToAccountId" :status="status" pt1 />
        <div>
          <StatusSpoiler :enabled="status.sensitive">
            <template #spoiler>
              {{ status.spoilerText }}
            </template>
            <StatusBody :status="status" />
            <StatusMedia
              v-if="status.mediaAttachments?.length"
              :status="status"
            />
          </StatusSpoiler>
          <StatusCard
            v-if="status.reblog"
            :status="status.reblog" border="~ rounded"
            :actions="false"
          />
        </div>
        <StatusActions v-if="actions !== false" pt2 :status="status" />
      </div>
    </div>
  </div>
</template>
