<script setup lang="ts">
import type { Filter, FilterAction, FilterContext, Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    context?: FilterContext
    hover?: boolean
    decorated?: boolean
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

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

// a bit of a hack due to Filter being different in v1 and v2
// clean up when masto.js supports explicit versions: https://github.com/neet/masto.js/issues/722
const filterPhrase = $computed(() => filter?.phrase || (filter as any)?.title)
const isFiltered = $computed(() => filterPhrase && (props.context ? filter?.context.includes(props.context) : false))

const avatarOnAvatar = $(computedEager(() => useFeatureFlags().experimentalAvatarOnAvatar))
</script>

<template>
  <div v-if="filter?.filterAction !== 'hide'" :id="`status-${status.id}`" ref="el" relative flex flex-col gap-2 px-4 pt-3 pb-4 transition-100 :class="{ 'hover:bg-active': hover }" tabindex="0" focus:outline-none focus-visible:ring="2 primary" @click="onclick" @keydown.enter="onclick">
    <StatusReplyingTo :status="status" />
    <CommonMetaWrapper v-if="rebloggedBy" text-secondary text-sm>
      <div i-ri:repeat-fill mr-1 text-primary />
      <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="!avatarOnAvatar" />
    </CommonMetaWrapper>
    <div v-if="decorated || rebloggedBy || status.inReplyToAccountId" h-4 />
    <div flex gap-4>
      <div relative>
        <AccountHoverWrapper :account="status.account" :class="rebloggedBy && avatarOnAvatar ? 'mt-4' : 'mt-1'">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountAvatar w-12 h-12 :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
        <div v-if="(rebloggedBy && avatarOnAvatar && rebloggedBy.id !== status.account.id)" absolute class="-top-1 -left-2" w-8 h-8 border-base border-3 rounded-full>
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
          <StatusSpoiler :enabled="status.sensitive || isFiltered" :filter="filter?.filterAction">
            <template #spoiler>
              <p>{{ filterPhrase ? `${$t('status.filter_hidden_phrase')}: ${filterPhrase}` : status.spoilerText }}</p>
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
  <div v-else-if="isFiltered" gap-2 px-4>
    <p>{{ filterPhrase && `${$t('status.filter_removed_phrase')}: ${filterPhrase}` }}</p>
  </div>
</template>
