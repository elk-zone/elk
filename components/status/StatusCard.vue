<script setup lang="ts">
import type { Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    hover?: boolean
  }>(),
  {
    actions: true,
    hover: true,
  },
)

const status = $computed(() => {
  if (props.status.reblog && !props.status.content)
    return props.status.reblog
  return props.status
})

const rebloggedBy = $computed(() => props.status.reblog ? props.status.account : null)

const el = ref<HTMLElement>()
const router = useRouter()

function onclick(e: MouseEvent) {
  const path = e.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  if (!el)
    go()
}

function go() {
  cacheStatus(status)
  router.push(getStatusPath(status))
}

const timeago = useTimeAgo(() => status.createdAt, {
  showSecond: true,
  messages: {
    justNow: 'just now',
    past: n => n,
    future: n => n.match(/\d/) ? `in ${n}` : n,
    month: (n, past) => n === 1
      ? past
        ? 'last month'
        : 'next month'
      : `${n}m`,
    year: (n, past) => n === 1
      ? past
        ? 'last year'
        : 'next year'
      : `${n}y`,
    day: (n, past) => n === 1
      ? past
        ? 'yesterday'
        : 'tomorrow'
      : `${n}d`,
    week: (n, past) => n === 1
      ? past
        ? 'last week'
        : 'next week'
      : `${n} week${n > 1 ? 's' : ''}`,
    hour: n => `${n}h`,
    minute: n => `${n}min`,
    second: n => `${n}s`,
  },
})
</script>

<template>
  <div ref="el" flex flex-col gap-2 px-4 transition-100 cursor-pointer :class="{ 'hover:bg-active': hover }" @click="onclick">
    <div v-if="rebloggedBy" pl8>
      <div flex gap-1 items-center text-gray:75 text-sm>
        <div i-ri:repeat-fill mr-1 />
        <AccountInlineInfo font-bold :account="rebloggedBy" />
        reblogged
      </div>
    </div>
    <div flex gap-4>
      <div relative flex-shrink-0>
        <div group>
          <AccountHoverCard top="-3.2" left="-4.4" absolute :account="status.account" op0 pointer-events-none group-hover="pointer-events-auto op100 scale-100" delay-250 transition transform scale-20 class="ease-[cubic-bezier(0.4, 0.0, 0.2, 1)]" />
          <AccountAvatar mt1 w-12 h-12 :account="status.account" />
        </div>
      </div>
      <div flex="~ col 1" w-0>
        <div flex>
          <StatusAccountDetails :account="status.account" />
          <div flex-auto />
          <div text-sm op50 :title="status.createdAt">
            {{ timeago }}
          </div>
        </div>
        <StatusReplyingTo v-if="status.inReplyToAccountId" :status="status" pt1 />
        <div>
          <StatusBody :status="status" />
          <StatusMedia
            v-if="status.mediaAttachments?.length"
            :status="status"
          />
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
