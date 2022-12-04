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

function onclick(evt: MouseEvent | KeyboardEvent) {
  const path = evt.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  const text = window.getSelection()?.toString()
  if (!el && !text)
    go(evt)
}

function go(evt: MouseEvent | KeyboardEvent) {
  const route = getStatusRoute(status)
  if (evt.metaKey || evt.ctrlKey) {
    window.open(route.href)
  }
  else {
    cacheStatus(status)
    router.push(route)
  }
}

const createdAt = useFormattedDateTime(status.createdAt)
const timeAgoOptions = useTimeAgoOptions(true)
const timeago = useTimeAgo(() => status.createdAt, timeAgoOptions)

const avatarOnAvatar = $(computedEager(() => useFeatureFlags().experimentalAvatarOnAvatar))
</script>

<template>
  <div :id="`status-${status.id}`" ref="el" relative flex flex-col gap-2 px-4 transition-100 :class="{ 'hover:bg-active': hover }" tabindex="0" focus:outline-none focus-visible:ring="2 primary" @click="onclick" @keydown.enter="onclick">
    <div v-if="status.inReplyToAccountId" absolute class="-top-3.5" left-2 bg-base pl-1 pb-1>
      <StatusReplyingTo :status="status" pt1 />
    </div>
    <div v-if="rebloggedBy" absolute class="-top-2.5" right-2 bg-base px-2>
      <div flex="~ wrap" gap-1 items-center text-secondary text-sm>
        <div i-ri:repeat-fill mr-1 />
        <i18n-t keypath="status.reblogged">
          <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="!avatarOnAvatar" />
        </i18n-t>
      </div>
    </div>
    <div v-if="rebloggedBy || status.inReplyToAccountId" h-0.5 />
    <div flex gap-4>
      <div relative>
        <AccountHoverWrapper :account="status.account" :class="rebloggedBy && avatarOnAvatar ? '-ml-1' : ''">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountAvatar w-12 h-12 :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
        <div v-if="(rebloggedBy && avatarOnAvatar && rebloggedBy.id !== status.account.id)" absolute top-7 left-5 w-8 h-8 border-base border-3 rounded-full>
          <AccountAvatar :account="rebloggedBy" />
        </div>
      </div>
      <div flex="~ col 1" min-w-0>
        <div flex items-center>
          <AccountHoverWrapper :account="status.account">
            <StatusAccountDetails :account="status.account" />
          </AccountHoverWrapper>
          <div flex-auto />
          <div v-if="!isZenMode" text-sm text-secondary flex="~ row nowrap" hover:underline>
            <CommonTooltip :content="createdAt">
              <a :title="status.createdAt" :href="getStatusRoute(status).href" @click.prevent="go($event)">
                <time text-sm hover:underline :datetime="status.createdAt">
                  {{ timeago }}
                </time>
              </a>
            </CommonTooltip>
            <StatusEditIndicator :status="status" inline />
          </div>
          <StatusActionsMore :status="status" mr--2 />
        </div>
        <div :class="status.visibility === 'direct' ? 'my3 p2 px5 br2 bg-fade rounded-3 rounded-tl-none' : ''">
          <StatusSpoiler :enabled="status.sensitive">
            <template #spoiler>
              <p>{{ status.spoilerText }}</p>
            </template>
            <StatusBody :status="status" />
            <StatusPoll v-if="status.poll" :poll="status.poll" />
            <StatusMedia
              v-if="status.mediaAttachments?.length"
              :status="status"
              minimized
            />
          </StatusSpoiler>
          <StatusCard
            v-if="status.reblog"
            :status="status.reblog" border="~ rounded"
            :actions="false"
          />
        </div>
        <StatusActions v-if="(actions !== false && !isZenMode)" pt2 :status="status" />
      </div>
    </div>
  </div>
</template>
