<script setup lang="ts">
import type { akkoma } from 'akko'
import type { GroupedLikeNotifications } from '~/types'

const { group } = defineProps<{
  group: GroupedLikeNotifications
}>()
const reblogs = computed(() => group.likes.filter(i => i.reblog))
const reactions = computed(() => group.likes.filter(i => i.reaction && !i.reblog))
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
        <div v-if="reactions.length" flex="~ gap-2 wrap">
          <template v-for="i, idx of reactions" :key="idx">
            <div flex gap-1 relative z-0>
              <div text-xl flex items-center z-1>
                <img v-if="(i.reaction as akkoma.v1.ReactionNotification).emojiUrl" :src="(i.reaction as akkoma.v1.ReactionNotification).emojiUrl" class="h-[20px]">
                <div v-else-if="(i.reaction as akkoma.v1.ReactionNotification).emoji">
                  {{ (i.reaction as akkoma.v1.ReactionNotification).emoji }}
                </div>
                <div v-else>
                  👍
                </div>
              </div>
              <AccountHoverWrapper :account="i.account" relative border="2 bg-base" ml--3 rounded-full hover:z-1 focus-within:z-1>
                <NuxtLink :to="getAccountRoute(i.account)">
                  <AccountAvatar text-primary font-bold :account="i.account" class="h-1.5em w-1.5em" />
                </NuxtLink>
              </AccountHoverWrapper>
            </div>
          </template>
          <div>
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
