<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  status: mastodon.v1.Status
}>()

const { client } = useMasto()

const replies = ref<mastodon.v1.Status[]>([])
const loading = ref(false)
const expanded = ref(false)
const commentText = ref('')
const posting = ref(false)
const loaded = ref(false)

const visibleReplies = computed(() => {
  if (expanded.value || replies.value.length <= 2)
    return replies.value
  return replies.value.slice(-2)
})

const totalCount = computed(() =>
  Math.max(replies.value.length, props.status.repliesCount || 0),
)

const remainingCount = computed(() =>
  expanded.value ? 0 : Math.max(0, totalCount.value - visibleReplies.value.length),
)

async function loadReplies() {
  if (loading.value || loaded.value)
    return
  loading.value = true
  try {
    const context = await client.value.v1.statuses.$select(props.status.id).context.fetch()
    // Direct replies only (excludes nested ones)
    replies.value = (context.descendants || []).filter(r => r.inReplyToId === props.status.id)
    loaded.value = true
  }
  catch (e) {
    console.error('[StatusInlineComments] Failed to load replies', e)
  }
  finally {
    loading.value = false
  }
}

async function postComment() {
  const text = commentText.value.trim()
  if (!text || posting.value)
    return
  if (!checkLogin())
    return

  posting.value = true
  try {
    const newReply = await client.value.v1.statuses.create({
      status: text,
      inReplyToId: props.status.id,
      visibility: props.status.visibility,
    })
    replies.value.push(newReply)
    commentText.value = ''
    loaded.value = true
  }
  catch (e) {
    console.error('[StatusInlineComments] Failed to post comment', e)
  }
  finally {
    posting.value = false
  }
}

const el = ref<HTMLElement>()
onMounted(() => {
  if (!props.status.repliesCount || !el.value)
    return
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadReplies()
      observer.disconnect()
    }
  }, { rootMargin: '200px' })
  observer.observe(el.value)
})

function timeSince(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60)
    return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7)
    return `${days}d`
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div ref="el" mt-3 pt-3 border-t border-base flex="~ col gap-2" @click.stop>
    <button
      v-if="remainingCount > 0"
      type="button"
      text-sm text-secondary text-left hover:text-primary self-start
      @click="expanded = true; loadReplies()"
    >
      View all {{ totalCount }} comments
    </button>

    <div
      v-for="reply in visibleReplies"
      :key="reply.id"
      flex="~ gap-2" items-start
    >
      <NuxtLink :to="getAccountRoute(reply.account)" shrink-0>
        <AccountAvatar :account="reply.account" w-8 h-8 />
      </NuxtLink>
      <div flex="~ col" flex-1 bg-card rounded-3 px-3 py-2 text-sm min-w-0>
        <NuxtLink :to="getAccountRoute(reply.account)" font-bold text-sm hover:underline>
          {{ reply.account.displayName || reply.account.username }}
        </NuxtLink>
        <div class="comment-content" v-html="reply.content" />
        <div text-xs text-secondary mt-1>
          {{ timeSince(reply.createdAt) }}
        </div>
      </div>
    </div>

    <div flex="~ gap-2" items-center mt-1>
      <AccountAvatar v-if="currentUser?.account" :account="currentUser.account" w-8 h-8 shrink-0 />
      <div v-else w-8 h-8 rounded-full bg-card shrink-0 />
      <input
        v-model="commentText"
        type="text"
        placeholder="Write a comment..."
        flex-1 bg-card rounded-full px-4 py-2 text-sm
        outline-none focus:ring-2 focus:ring-primary
        :disabled="posting"
        @keydown.enter.prevent="postComment"
      >
    </div>
  </div>
</template>

<style scoped>
.comment-content :deep(p) {
  margin: 0;
}
.comment-content :deep(p + p) {
  margin-top: 0.25rem;
}
.comment-content :deep(a) {
  color: var(--c-primary);
}
.comment-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
