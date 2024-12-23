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
        <div v-if="reblogs.length" flex="~ gap-1">
          <div i-ri:repeat-fill text-xl me-2 color-green />
          <template v-for="i, idx of reblogs" :key="idx">
            <AccountHoverWrapper :account="i.account">
              <NuxtLink :to="getAccountRoute(i.account)">
                <AccountAvatar text-primary font-bold :account="i.account" class="h-1.5em w-1.5em" />
              </NuxtLink>
            </AccountHoverWrapper>
          </template>
          <div ml1>
            {{ $t('notification.reblogged_post') }}
          </div>
        </div>
        <div v-if="likes.length" flex="~ gap-1 wrap">
          <div :class="useStarFavoriteIcon ? 'i-ri:star-line color-yellow' : 'i-ri:heart-line color-red'" text-xl me-2 />
          <template v-for="i, idx of likes" :key="idx">
            <AccountHoverWrapper :account="i.account" relative me--4 border="2 bg-base" rounded-full hover:z-1 focus-within:z-1>
              <NuxtLink :to="getAccountRoute(i.account)">
                <AccountAvatar text-primary font-bold :account="i.account" class="h-1.5em w-1.5em" />
              </NuxtLink>
            </AccountHoverWrapper>
          </template>
          <div ms-4>
            {{ $t('notification.favourited_post') }}
          </div>
        </div>
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
