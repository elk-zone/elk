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
    <div flex gap-3 :class="{ 'text-secondary': faded }">
      <div relative>
        <template v-if="showRebloggedByAvatarOnAvatar">
          <div absolute top--3px left--0.8 z--1 w-25px h-25px rounded-full>
            <AccountAvatar :account="rebloggedBy" />
          </div>
        </template>
        <AccountHoverWrapper :account="status.account">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <!-- 50px === 48px + 2px of border -->
            <AccountAvatar :account="status.account" w-52px h-52px :class="showRebloggedByAvatarOnAvatar ? 'mt-11px border-2 border-bg-base' : 'p-2px mt-3px'" />
          </NuxtLink>
        </AccountHoverWrapper>
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
        <div
          space-y-3
          :class="{
            'mt2 pt1 pb0.5 px3.5 br2 bg-fade border-primary-light border-1 rounded-3 rounded-tl-none': isDM,
          }"
        >
          <StatusSpoiler :enabled="status.sensitive || isFiltered" :filter="isFiltered">
            <template v-if="status.spoilerText || filterPhrase" #spoiler>
              <p>{{ status.spoilerText || `${$t('status.filter_hidden_phrase')}: ${filterPhrase}` }}</p>
            </template>
            <StatusBody :status="status" />
            <StatusPoll
              v-if="status.poll"
              :poll="status.poll"
            />
            <StatusMedia
              v-if="status.mediaAttachments?.length"
              :status="status"
            />
            <StatusPreviewCard
              v-if="status.card"
              :card="status.card"
              :small-picture-only="status.mediaAttachments?.length > 0"
            />
            <StatusCard
              v-if="status.reblog"
              :status="status.reblog" border="~ rounded"
              :actions="false"
            />
            <div v-if="isDM" />
          </StatusSpoiler>
        </div>
        <StatusActions v-if="(actions !== false && !isZenMode)" :status="status" :class="isDM ? 'mt1' : 'mt2'" />
      </div>
    </div>
  </div>
  <div v-else-if="isFiltered" gap-2 p-4>
    <p text-center text-secondary text-sm>
      {{ filterPhrase && `${$t('status.filter_removed_phrase')}: ${filterPhrase}` }}
    </p>
  </div>
</template>
