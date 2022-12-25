<script setup lang="ts">
import type { FilterContext, Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    context?: FilterContext
    hover?: boolean
    faded?: boolean
    showReplyTo?: boolean
    connectReply?: boolean
  }>(),
  { actions: true, showReplyTo: true },
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

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

// a bit of a hack due to Filter being different in v1 and v2
// clean up when masto.js supports explicit versions: https://github.com/neet/masto.js/issues/722
const filterPhrase = $computed(() => filter?.phrase || (filter as any)?.title)
const isFiltered = $computed(() => filterPhrase && (props.context ? filter?.context.includes(props.context) : false))

const avatarOnAvatar = $(computedEager(() => useFeatureFlags().experimentalAvatarOnAvatar))
const showRebloggedByAvatarOnAvatar = $computed(() => rebloggedBy && avatarOnAvatar && rebloggedBy.id !== status.account.id)

const isDM = $computed(() => status.visibility === 'direct')
const isSelf = $computed(() => status.account.id === currentUser.value?.account.id)
</script>

<template>
  <div v-if="filter?.filterAction !== 'hide'" :id="`status-${status.id}`" ref="el" relative flex flex-col gap-1 px-4 pt-1 class="pb-1.5" transition-100 :class="{ 'hover:bg-active': hover }" tabindex="0" focus:outline-none focus-visible:ring="2 primary" @click="onclick" @keydown.enter="onclick">
    <div flex justify-between>
      <slot name="meta">
        <div v-if="rebloggedBy" text-secondary text-sm ws-nowrap flex="~" gap-1 items-center py1>
          <div i-ri:repeat-fill mr-1 text-primary />
          <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="!avatarOnAvatar" />
        </div>
        <div v-else />
      </slot>
      <StatusReplyingTo v-if="showReplyTo" :status="status" :class="faded ? 'text-secondary-light' : ''" py1 />
    </div>
    <div flex gap-4 :class="faded ? 'text-secondary' : ''">
      <div relative>
        <AccountHoverWrapper :account="status.account" :class="showRebloggedByAvatarOnAvatar ? 'mt-4' : 'mt-1'">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountAvatar w-12 h-12 :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
        <div v-if="showRebloggedByAvatarOnAvatar" absolute class="-top-1 -left-2" w-9 h-9 border-bg-base border-3 rounded-full>
          <AccountAvatar :account="rebloggedBy" />
        </div>
        <div v-if="connectReply" w-full h-full flex justify-center>
          <div h-full w1 bg-border />
        </div>
      </div>
      <div flex="~ col 1" min-w-0>
        <div flex items-center space-x-1>
          <AccountHoverWrapper :account="status.account">
            <StatusAccountDetails :account="status.account" />
          </AccountHoverWrapper>
          <div flex-auto />
          <div v-if="!isZenMode" text-sm text-secondary flex="~ row nowrap" hover:underline>
            <AccountBotIndicator v-if="status.account.bot" mr-2 />
            <CommonTooltip :content="createdAt">
              <a :title="status.createdAt" :href="getStatusRoute(status).href" @click.prevent="go($event)">
                <time text-sm ws-nowrap hover:underline :datetime="status.createdAt">
                  {{ timeago }}
                </time>
              </a>
            </CommonTooltip>
            <StatusEditIndicator :status="status" inline />
          </div>
          <StatusActionsMore :status="status" mr--2 />
        </div>
        <StatusContent :status="status" :context="context" mb2 :class="{ mt2: isDM }" />
        <div>
          <StatusActions v-if="(actions !== false && !isZenMode)" :status="status" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isFiltered" gap-2 p-4>
    <p text-center text-secondary text-sm>
      {{ filterPhrase && `${$t('status.filter_removed_phrase')}: ${filterPhrase}` }}
    </p>
  </div>
</template>
