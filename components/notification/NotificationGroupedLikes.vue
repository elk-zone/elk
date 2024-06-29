<script setup lang="ts">
import type { GroupedLikeNotifications } from '~/types'

const { group } = defineProps<{
  group: GroupedLikeNotifications
}>()
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')

const reblogs = computed(() => group.likes.filter(i => i.reblog))
const likes = computed(() => group.likes.filter(i => i.favourite && !i.reblog))
</script>

<template>
  <article flex flex-col relative>
    <StatusLink :status="group.status!" pb4 pt5>
      <div flex flex-col gap-3>
        <NotificationGroupedLikeItem
          v-if="reblogs.length"
          :likes="reblogs"
          :hint="$t('notification.reblogged_post')"
        >
          <template #icon>
            <div i-ri:repeat-fill text-xl me-2 color-green />
          </template>
        </NotificationGroupedLikeItem>
        <NotificationGroupedLikeItem
          v-if="likes.length"
          :likes="likes"
          :hint="$t('notification.favourited_post')"
        >
          <template #icon>
            <div :class="useStarFavoriteIcon ? 'i-ri:star-line color-yellow' : 'i-ri:heart-line color-red'" text-xl me-2 />
          </template>
        </NotificationGroupedLikeItem>
      </div>
      <div ps9 mt-1>
        <StatusBody :status="group.status!" text-secondary />
        <!-- When no text content is presented, we show media instead -->
        <template v-if="!group.status!.content">
          <StatusMedia
            v-if="group.status!.mediaAttachments?.length"
            :status="group.status!"
            :is-preview="false"
            pointer-events-none
          />
          <StatusPoll
            v-else-if="group.status!.poll"
            :status="group.status!"
          />
        </template>
      </div>
    </StatusLink>
  </article>
</template>
