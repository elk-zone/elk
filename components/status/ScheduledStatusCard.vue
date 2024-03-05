<script setup lang="ts">
import type { mastodon } from 'masto'

const { scheduledStatus } = defineProps<{
  scheduledStatus: mastodon.v1.ScheduledStatus
  context?: mastodon.v2.FilterContext
  hover?: boolean
  inNotification?: boolean
  isPreview?: boolean
}>()

const scheduledPost = scheduledStatus

const client = useMastoClient()

async function cancelSchedule(id: string) {
  const status = await client.v1.scheduledStatuses.$select(id)
  if (confirm('Are you sure to cancel this scheduled post?'))
    status.remove()
}

// const userSettings = useUserSettings()
//
// const status = computed(() => {
//   if (props.scheduledStatus.reblog && (!props.scheduledStatus.content || props.scheduledStatus.content === props.scheduledStatus.reblog.content))
//     return props.scheduledStatus.reblog
//   return props.scheduledStatus
// })
//
// // Use original status, avoid connecting a reblog
// const directReply = computed(() => props.hasNewer || (!!status.value.inReplyToId && (status.value.inReplyToId === props.newer?.id || status.value.inReplyToId === props.newer?.reblog?.id)))
// // Use reblogged status, connect it to further replies
// const connectReply = computed(() => props.hasOlder || status.value.id === props.older?.inReplyToId || status.value.id === props.older?.reblog?.inReplyToId)
// // Open a detailed status, the replies directly to it
// const replyToMain = computed(() => props.main && props.main.id === status.value.inReplyToId)
//
// const rebloggedBy = computed(() => props.scheduledStatus.reblog ? props.scheduledStatus.account : null)
//
// const statusRoute = computed(() => getStatusRoute(status.value))
//
// const router = useRouter()
//
// function go(evt: MouseEvent | KeyboardEvent) {
//   if (evt.metaKey || evt.ctrlKey) {
//     window.open(statusRoute.value.href)
//   }
//   else {
//     cacheStatus(status.value)
//     router.push(statusRoute.value)
//   }
// }
//
// const createdAt = useFormattedDateTime(status.value.createdAt)
// const timeAgoOptions = useTimeAgoOptions(true)
// const timeago = useTimeAgo(() => status.value.createdAt, timeAgoOptions)
//
// const isSelfReply = computed(() => status.value.inReplyToAccountId === status.value.account.id)
// const collapseRebloggedBy = computed(() => rebloggedBy.value?.id === status.value.account.id)
// const isDM = computed(() => status.value.visibility === 'direct')
//
// const showUpperBorder = computed(() => props.newer && !directReply.value)
// const showReplyTo = computed(() => !replyToMain.value && !directReply.value)
//
// const forceShow = ref(false)
</script>

<template>
  <div>
    <div flex items-center p2>
      <div i-ri:calendar-schedule-line me-2 />
      Scheduled: {{ new Date(scheduledPost.scheduledAt).toLocaleString() }}
    </div>
    <p p2>
      {{ scheduledPost.params.text }}
    </p>
    <p>
      <button
        px3 py1 border-3 rounded-3 bg-primary text-white
        @click="cancelSchedule(scheduledPost.id)"
      >
        Cancel schedule
      </button>
    </p>
    <details>
      <blockquote border-1 p2>
        <code>{{ scheduledPost }}</code>
      </blockquote>
    </details>
  </div>
<!--  <StatusLink :status="status" :hover="hover"> -->
<!--    &lt;!&ndash; Upper border &ndash;&gt; -->
<!--    <div :h="showUpperBorder ? '1px' : '0'" w-auto bg-border mb-1 /> -->

<!--    <slot name="meta"> -->
<!--      &lt;!&ndash; Line connecting to previous status &ndash;&gt; -->
<!--      <template v-if="status.inReplyToAccountId"> -->
<!--        <StatusReplyingTo -->
<!--          v-if="showReplyTo" -->
<!--          m="is-5" p="t-1 is-5" -->
<!--          :status="status" -->
<!--          :is-self-reply="isSelfReply" -->
<!--          :class="inNotification ? 'text-secondary-light' : ''" -->
<!--        /> -->
<!--        <div flex="~ col gap-1" items-center pos="absolute top-0 inset-is-0" w="77px" z&#45;&#45;1> -->
<!--          <template v-if="showReplyTo"> -->
<!--            <div w="1px" h="0.5" border="x base" mt-3 /> -->
<!--            <div w="1px" h="0.5" border="x base" /> -->
<!--            <div w="1px" h="0.5" border="x base" /> -->
<!--          </template> -->
<!--          <div w="1px" h-10 border="x base" /> -->
<!--        </div> -->
<!--      </template> -->

<!--      &lt;!&ndash; Reblog status &ndash;&gt; -->
<!--      <div flex="~ col" justify-between> -->
<!--        <div -->
<!--          v-if="rebloggedBy && !collapseRebloggedBy" -->
<!--          flex="~" items-center -->
<!--          p="t-1 b-0.5 x-1px" -->
<!--          relative text-secondary ws-nowrap -->
<!--        > -->
<!--          <div i-ri:repeat-fill me-46px text-green w-16px h-16px class="status-boosted" /> -->
<!--          <div absolute top-1 ms-24px w-32px h-32px rounded-full> -->
<!--            <AccountHoverWrapper :account="rebloggedBy"> -->
<!--              <NuxtLink :to="getAccountRoute(rebloggedBy)"> -->
<!--                <AccountAvatar :account="rebloggedBy" /> -->
<!--              </NuxtLink> -->
<!--            </AccountHoverWrapper> -->
<!--          </div> -->
<!--          <AccountInlineInfo font-bold :account="rebloggedBy" :avatar="false" text-sm /> -->
<!--        </div> -->
<!--      </div> -->
<!--    </slot> -->

<!--    <div flex gap-3 :class="{ 'text-secondary': inNotification }"> -->
<!--      <template v-if="status.account.suspended && !forceShow"> -->
<!--        <div flex="~col 1" min-w-0> -->
<!--          <p italic> -->
<!--            {{ $t('status.account.suspended_message') }} -->
<!--          </p> -->
<!--          <div> -->
<!--            <button p-0 flex="~ center" gap-2 text-sm btn-text @click="forceShow = true"> -->
<!--              <div i-ri:eye-line /> -->
<!--              <span>{{ $t('status.account.suspended_show') }}</span> -->
<!--            </button> -->
<!--          </div> -->
<!--        </div> -->
<!--      </template> -->
<!--      <template v-else> -->
<!--        &lt;!&ndash; Avatar &ndash;&gt; -->
<!--        <div relative> -->
<!--          <div v-if="collapseRebloggedBy" absolute flex items-center justify-center top&#45;&#45;6px px-2px py-3px rounded-full bg-base> -->
<!--            <div i-ri:repeat-fill text-green w-16px h-16px /> -->
<!--          </div> -->
<!--          <AccountHoverWrapper :account="status.account"> -->
<!--            <NuxtLink :to="getAccountRoute(status.account)" rounded-full> -->
<!--              <AccountBigAvatar :account="status.account" /> -->
<!--            </NuxtLink> -->
<!--          </AccountHoverWrapper> -->

<!--          <div v-if="connectReply" w-full h-full flex mt&#45;&#45;3px justify-center> -->
<!--            <div w-1px border="x base" mb-9 /> -->
<!--          </div> -->
<!--        </div> -->

<!--        &lt;!&ndash; Main &ndash;&gt; -->
<!--        <div flex="~ col 1" min-w-0> -->
<!--          &lt;!&ndash; Account Info &ndash;&gt; -->
<!--          <div flex items-center space-x-1> -->
<!--            <AccountHoverWrapper :account="status.account"> -->
<!--              <StatusAccountDetails :account="status.account" /> -->
<!--            </AccountHoverWrapper> -->
<!--            <div flex-auto /> -->
<!--            <div v-show="!getPreferences(userSettings, 'zenMode')" text-sm text-secondary flex="~ row nowrap" hover:underline whitespace-nowrap> -->
<!--              <AccountLockIndicator v-if="status.account.locked" me-2 /> -->
<!--              <AccountBotIndicator v-if="status.account.bot" me-2 /> -->
<!--              <div flex="~ gap1" items-center> -->
<!--                <StatusVisibilityIndicator v-if="status.visibility !== 'public'" :status="status" /> -->
<!--                <div flex> -->
<!--                  <CommonTooltip :content="createdAt" no-auto-focus> -->
<!--                    <NuxtLink :title="status.createdAt" :href="statusRoute.href" @click.prevent="go($event)"> -->
<!--                      <time text-sm ws-nowrap hover:underline :datetime="status.createdAt"> -->
<!--                        {{ timeago }} -->
<!--                      </time> -->
<!--                    </NuxtLink> -->
<!--                  </CommonTooltip> -->
<!--                  <StatusEditIndicator :status="status" inline /> -->
<!--                </div> -->
<!--              </div> -->
<!--            </div> -->
<!--            <StatusActionsMore v-if="actions !== false" :status="status" me&#45;&#45;2 /> -->
<!--          </div> -->

<!--          &lt;!&ndash; Content &ndash;&gt; -->
<!--          <StatusContent -->
<!--            :status="status" -->
<!--            :newer="newer" -->
<!--            :context="context" -->
<!--            :is-preview="isPreview" -->
<!--            :in-notification="inNotification" -->
<!--            mb2 :class="{ 'mt-2 mb1': isDM }" -->
<!--          /> -->
<!--          <StatusActions v-if="actions !== false" v-show="!getPreferences(userSettings, 'zenMode')" :status="status" /> -->
<!--        </div> -->
<!--      </template> -->
<!--    </div> -->
<!--  </StatusLink> -->
</template>
