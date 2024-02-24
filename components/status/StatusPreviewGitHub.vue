<script setup lang="ts">
import type { mastodon } from 'masto'
import reservedNames from 'github-reserved-names'

const props = defineProps<{
  card: mastodon.v1.PreviewCard
}>()

type UrlType = 'user' | 'repo' | 'issue' | 'pull'
interface Meta {
  type: UrlType
  user?: string
  titleUrl: string
  avatar: string
  details: string
  repo?: string
  number?: string
  author?: {
    avatar: string
    user: string
  }
}

// Supported paths
// /user
// /user/repo
// /user/repo/issues/number
// /user/repo/pull/number
// /sponsors/user
const supportedReservedRoutes = ['sponsors']

const meta = computed(() => {
  const { url } = props.card
  const path = url.split('https://github.com/')[1]
  const [firstName, secondName] = path?.split('/') || []
  if (!firstName || (reservedNames.check(firstName) && !supportedReservedRoutes.includes(firstName)))
    return undefined

  const firstIsUser = firstName && !supportedReservedRoutes.includes(firstName)
  const user = firstIsUser ? firstName : secondName
  const repo = firstIsUser ? secondName : undefined

  let type: UrlType = repo ? 'repo' : 'user'
  let number: string | undefined
  let details = (props.card.title ?? '').replace('GitHub - ', '').split(' · ')[0]

  if (repo) {
    const repoPath = `${user}/${repo}`
    details = details.replace(`${repoPath}: `, '')
    const inRepoPath = path.split(`${repoPath}/`)?.[1]
    if (inRepoPath) {
      number = inRepoPath.match(/issues\/(\d+)/)?.[1]
      if (number) {
        type = 'issue'
      }
      else {
        number = inRepoPath.match(/pull\/(\d+)/)?.[1]
        if (number)
          type = 'pull'
      }
    }
  }

  const avatar = `https://github.com/${user}.png?size=256`

  const author = props.card.authorName
  return {
    type,
    user,
    titleUrl: `https://github.com/${user}${repo ? `/${repo}` : ''}`,
    details,
    repo,
    number,
    avatar,
    author: author
      ? {
          avatar: `https://github.com/${author}.png?size=64`,
          user: author,
        }
      : undefined,
  } satisfies Meta
})
</script>

<template>
  <div
    v-if="card.image && meta"
    flex flex-col
    display-block of-hidden
    bg-card
    relative
    w-full min-h-50 md:min-h-60
    justify-center
    rounded-lg
  >
    <div p4 sm:px-8 flex flex-col justify-between min-h-50 md:min-h-60 h-full>
      <div flex justify-between items-center gap-2 sm:gap-6 h-full mb-2 min-h-35 md:min-h-45>
        <div flex flex-col gap-2>
          <NuxtLink flex gap-1 text-xl sm:text-3xl flex-wrap leading-none :href="meta.titleUrl" target="_blank" external>
            <template v-if="meta.repo">
              <span>{{ meta.user }}</span><span text-secondary-light>/</span><span text-primary font-bold>{{ meta.repo }}</span>
            </template>
            <span v-else>{{ meta.user }}</span>
          </NuxtLink>
          <NuxtLink sm:text-lg :href="card.url" target="_blank" external>
            <span v-if="meta.type === 'issue'" text-secondary-light me-2>
              #{{ meta.number }}
            </span>
            <span v-if="meta.type === 'pull'" text-secondary-light me-2>
              PR #{{ meta.number }}
            </span>
            <span text-secondary leading-tight>{{ meta.details }}</span>
          </NuxtLink>
        </div>
        <div shrink-0 w-18 sm:w-30>
          <NuxtLink :href="meta.titleUrl" target="_blank" external>
            <img w-full aspect-square width="112" height="112" rounded-2 :src="meta.avatar">
          </NuxtLink>
        </div>
      </div>
      <div flex justify-between>
        <div v-if="meta.author" flex class="gap-2.5" items-center>
          <div>
            <img w-8 aspect-square width="25" height="25" rounded-full :src="meta.author?.avatar">
          </div>
          <span text-lg text-primary>@{{ meta.author?.user }}</span>
        </div>
        <div v-else />
        <div text-3xl i-ri:github-fill text-secondary />
      </div>
    </div>
  </div>
  <StatusPreviewCardNormal v-else :card="card" />
</template>
