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
const connectReply = $computed(() => props.hasOlder || status.id === props.older?.inReplyToId)

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
    transition-100
    :class="{ 'hover:bg-active': hover, 'border-t border-base': newer && !directReply }"
    tabindex="0"
    focus:outline-none focus-visible:ring="2 primary"
    :lang="status.language ?? undefined"
    :dir="status.language ? 'auto' : 'ltr'"
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div flex justify-between>
      <slot name="meta">
        <div v-if="rebloggedBy && !collapseRebloggedBy" relative text-secondary text-sm ws-nowrap flex="~" gap-1 items-center pt-1 px-1 bg-base>
          <div i-ri:repeat-fill mr-11 text-primary />
          <div absolute top-1.5 left-7 w-30px h-30px rounded-full>
            <AccountAvatar :account="rebloggedBy" />
          </div>
          <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="false" />
        </div>
        <div v-else />
      </slot>
      <StatusReplyingTo v-if="!directReply && !collapseReplyingTo" :status="status" :simplified="simplifyReplyingTo" :class="faded ? 'text-secondary-light' : ''" py1 />
    </div>
    <div flex gap-3 :class="{ 'text-secondary': faded }">
      <div relative>
        <div v-if="collapseRebloggedBy" absolute left--0.8 rtl-left-none rtl-right--0.8 w-5.5 h-5.5 rounded-full bg-base>
          <div i-ri:repeat-fill mr-1 text-primary text-sm />
        </div>
        <AccountHoverWrapper :account="status.account">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountBigAvatar :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
        <div v-if="connectReply" w-full h-full flex justify-center>
          <div h-full class="w-2.5px" bg-border />
        </div>
      </div>
      <div flex="~ col 1" min-w-0>
        <div flex items-center space-x-1>
          <AccountHoverWrapper :account="status.account">
            <StatusAccountDetails :account="status.account" />
          </AccountHoverWrapper>
          <div v-if="!directReply && collapseReplyingTo" flex="~" pl-1 items-center justify-center>
            <StatusReplyingTo :collapsed="true" :status="status" :class="faded ? 'text-secondary-light' : ''" />
          </div>
          <div flex-auto />
          <div v-if="!isZenMode" text-sm text-secondary flex="~ row nowrap" hover:underline>
            <AccountBotIndicator v-if="status.account.bot" mr-2 />
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
          <StatusActionsMore v-if="actions !== false" :status="status" mr--2 />
        </div>
        <StatusContent :status="status" :context="context" mb2 :class="{ mt2: isDM }" />
        <div>
          <StatusActions v-if="(actions !== false && !isZenMode)" :status="status" />
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
