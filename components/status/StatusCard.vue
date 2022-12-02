<script setup lang="ts">
import type { FilterContext, Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
    context?: FilterContext
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
const timeago = useTimeAgo(() => status.createdAt, timeAgoOptions)

// TODO: get from status.filtered props and remove check for status.content
const filterPhrase = status.content.toLowerCase().includes('twitter') ? 'Twitter' : null
const filterContext = ['public', 'home', 'thread', 'notifications']
const filterAction = 'warn' // could be 'hide' (no way to show) or 'warn' (could be expanded to show)

// filter conditions
const isFiltered = filterPhrase && props.context && filterContext.includes(props.context)
const action = isFiltered && filterAction
</script>

<template>
  <div v-if="action !== 'hide'" :id="`status-${status.id}`" ref="el" flex flex-col gap-2 px-4 transition-100 :class="{ 'hover:bg-active': hover }" tabindex="0" focus:outline-none focus-visible:ring="2 primary" @click="onclick" @keydown.enter="onclick">
    <div v-if="rebloggedBy" pl8>
      <div flex="~ wrap" gap-1 items-center text-secondary text-sm>
        <div i-ri:repeat-fill mr-1 />
        <i18n-t keypath="status.reblogged">
          <AccountInlineInfo font-bold :account="rebloggedBy" />
        </i18n-t>
      </div>
    </div>
    <div flex gap-4>
      <div>
        <AccountHoverWrapper :account="status.account">
          <NuxtLink :to="getAccountRoute(status.account)" rounded-full>
            <AccountAvatar w-12 h-12 :account="status.account" />
          </NuxtLink>
        </AccountHoverWrapper>
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
        <StatusReplyingTo v-if="status.inReplyToAccountId" :status="status" pt1 />
        <div :class="status.visibility === 'direct' ? 'my3 p2 px5 br2 bg-fade rounded-3 rounded-tl-none' : ''">
          <StatusSpoiler :enabled="status.sensitive || action === 'warn'" :filter="action">
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
  <div v-else gap-2 px-4>
    <p>{{ filterPhrase ? `${$t('status.filter_removed_phrase')}: ${filterPhrase}` : status.spoilerText }}</p>
  </div>
</template>
