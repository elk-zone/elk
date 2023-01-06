<script setup lang="ts">
import type { FilterContext, Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    context?: FilterContext
    hover?: boolean
    faded?: boolean

    // If we know the prev and next status in the timeline, we can simplify the card
    older?: Status
    newer?: Status
    // Manual overrides
    hasOlder?: boolean
    hasNewer?: boolean
    // When looking into a detailed view of a post, we can simplify the replying badges
    // to the main expanded post
    main?: Status
  }>(),
  { actions: true, showReplyTo: true },
)

const status = $computed(() => {
  if (props.status.reblog && !props.status.content)
    return props.status.reblog
  return props.status
})

// Use original status, avoid connecting a reblog
const directReply = $computed(() => props.hasNewer || (!!status.inReplyToId && (status.inReplyToId === props.newer?.id || status.inReplyToId === props.newer?.reblog?.id)))
// Use reblogged status, connect it to further replies
const connectReply = $computed(() => props.hasOlder || status.id === props.older?.inReplyToId || status.id === props.older?.reblog?.inReplyToId)

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

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

// a bit of a hack due to Filter being different in v1 and v2
// clean up when masto.js supports explicit versions: https://github.com/neet/masto.js/issues/722
const filterPhrase = $computed(() => filter?.phrase || (filter as any)?.title)
const isFiltered = $computed(() => filterPhrase && (props.context ? filter?.context.includes(props.context) : false))

const collapseRebloggedBy = $computed(() => rebloggedBy?.id === status.account.id)

// Collapse ReplyingTo badge if it is a self-reply (thread)
const collapseReplyingTo = $computed(() => (!rebloggedBy || collapseRebloggedBy) && status.inReplyToAccountId === status.account.id)

// Only show avatar in ReplyingTo badge if it was reblogged by the same account or if it is against the main post
const simplifyReplyingTo = $computed(() =>
  (props.main && props.main.account.id === status.inReplyToAccountId) || (rebloggedBy && rebloggedBy.id === status.inReplyToAccountId),
)

const isDM = $computed(() => status.visibility === 'direct')
</script>

<template>
  <div
    v-if="filter?.filterAction !== 'hide'"
    :id="`status-${status.id}`"
    ref="el"
    relative flex flex-col gap-1 pl-3 pr-4 pt-1
    class="pb-1.5"
    :class="{ 'hover:bg-active': hover }"
    tabindex="0"
    focus:outline-none focus-visible:ring="2 primary"
    :lang="status.language ?? undefined"
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div v-if="newer && !directReply" w-auto h-1px bg-border />
    <div flex justify-between>
      <slot name="meta">
        <div v-if="rebloggedBy && !collapseRebloggedBy" relative text-secondary ws-nowrap flex="~" items-center pt1 pb0.5 px-1px bg-base>
          <div i-ri:repeat-fill me-46px text-primary w-16px h-16px />
          <div absolute top-1 ms-24px w-32px h-32px rounded-full>
            <AccountHoverWrapper :account="rebloggedBy">
              <NuxtLink :to="getAccountRoute(rebloggedBy)">
                <AccountAvatar :account="rebloggedBy" />
              </NuxtLink>
            </AccountHoverWrapper>
          </div>
          <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="false" text-sm />
        </div>
        <div v-else />
      </slot>
      <StatusReplyingTo v-if="!directReply && !collapseReplyingTo" :status="status" :simplified="!!simplifyReplyingTo" :class="faded ? 'text-secondary-light' : ''" pt1 />
    </div>
    <div flex gap-3 :class="{ 'text-secondary': faded }">
      <div relative>
        <div v-if="collapseRebloggedBy" absolute flex items-center justify-center top--6px px-2px py-3px rounded-full bg-base>
          <div i-ri:repeat-fill text-primary w-16px h-16px />
        </div>
        <AccountHoverWrapper :account="status.account">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountBigAvatar :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
        <div v-if="connectReply" w-full h-full flex justify-center>
          <div class="w-2.5px" bg-primary-light />
        </div>
      </div>
      <div flex="~ col 1" min-w-0>
        <div flex items-center space-x-1>
          <AccountHoverWrapper :account="status.account">
            <StatusAccountDetails :account="status.account" />
          </AccountHoverWrapper>
          <div v-if="!directReply && collapseReplyingTo" flex="~" ps-1 items-center justify-center>
            <StatusReplyingTo :collapsed="true" :status="status" :class="faded ? 'text-secondary-light' : ''" />
          </div>
          <div flex-auto />
          <div v-if="!userSettings.zenMode" text-sm text-secondary flex="~ row nowrap" hover:underline>
            <AccountBotIndicator v-if="status.account.bot" me-2 />
            <div flex>
              <CommonTooltip :content="createdAt">
                <a :title="status.createdAt" :href="getStatusRoute(status).href" @click.prevent="go($event)">
                  <time text-sm ws-nowrap hover:underline :datetime="status.createdAt">
                    {{ timeago }}
                  </time>
                </a>
              </CommonTooltip>
              <StatusEditIndicator :status="status" inline />
            </div>
          </div>
          <StatusActionsMore v-if="actions !== false" :status="status" me--2 />
        </div>
        <StatusContent :status="status" :context="context" mb2 :class="{ 'mt-2 mb1': isDM }" />
        <div>
          <StatusActions v-if="(actions !== false && !userSettings.zenMode)" :status="status" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isFiltered" gap-2 p-4 :class="{ 'border-t border-base': newer }">
    <p text-center text-secondary text-sm>
      {{ filterPhrase && `${$t('status.filter_removed_phrase')}: ${filterPhrase}` }}
    </p>
  </div>
</template>
