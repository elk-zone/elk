<script setup lang="ts">
import type { Card } from 'masto'

const props = defineProps<{
  card: Card
}>()

type UrlType = 'user' | 'repo' | 'issue' | 'pull'
interface Meta {
  type: UrlType
  user: string
  titleUrl: string
  avatar: string
  details: string
  repo?: string
  number?: string
  extra?: {
    state: string
    author?: {
      avatar: string
      user: string
    }
  }
}

const meta = $computed(() => {
  const { url } = props.card
  const path = url.split('https://github.com/')[1]
  const user = path.match(/([\w-]+)\//)![1]
  const repo = path.match(/[\w-]+\/([\w-]+)/)?.[1]
  const repoPath = `${user}/${repo}`
  const inRepoPath = path.split(`${repoPath}/`)?.[1]
  let number: string | undefined
  let type: UrlType = repo ? 'repo' : 'user'
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
  const avatar = `https://github.com/${user}.png`
  const details = (props.card.title ?? '').replace('GitHub - ', '').replace(`${repoPath}: `, '').split(' · ')[0]
  const info = $ref<Meta>({
    type,
    user,
    titleUrl: `https://github.com/${user}${repo ? `/${repo}` : ''}`,
    details,
    repo,
    number,
    avatar,
  })
  /* It is rate limited for anonymous usage, leaving this to play, but for now it is probably better to avoid the call
     We can't show the author of the PR or issue without this info, because the handle isn't in the meta. I think we
     could ask GitHub to add it.

  if (number) {
    fetch(`https://api.github.com/repos/${user}/${repo}/issues/${number}`).then(res => res.json()).then((data) => {
      info.extra = {
        state: data.state as string,
        author: {
          avatar: data.user.avatar_url as string,
          user: data.user.login as string,
        },
      }
    })
  }
  */
  return info
})
</script>

<template>
  <div
    v-if="card.image"
    flex flex-col
    display-block of-hidden
    bg-code
    relative
    border="base"
    w-full min-h-50 md:min-h-60 border-b
    justify-center
    rounded-lg
  >
    <div p4 sm:px-8 flex flex-col justify-between min-h-50 md:min-h-60 h-full>
      <div flex justify-between items-center gap-2 sm:gap-6 h-full mb-2 min-h-35 md:min-h-45>
        <div flex flex-col gap-2>
          <a flex gap-1 text-xl sm:text-3xl flex-wrap leading-none :href="meta.titleUrl" target="_blank">
            <template v-if="meta.repo">
              <span>{{ meta.user }}</span><span text-secondary-light>/</span><span text-primary font-bold>{{ meta.repo }}</span>
            </template>
            <span v-else>{{ meta.user }}</span>
          </a>
          <a sm:text-lg :href="card.url" target="_blank">
            <span v-if="meta.type === 'issue'" text-secondary-light mr-2>
              #{{ meta.number }}
            </span>
            <span v-if="meta.type === 'pull'" text-secondary-light mr-2>
              PR #{{ meta.number }}
            </span>
            <span text-secondary leading-tight>{{ meta.details }}</span>
          </a>
        </div>
        <div>
          <a :href="meta.titleUrl" target="_blank">
            <img w-30 aspect-square width="20" height="20" rounded-2 :src="meta.avatar">
          </a>
        </div>
      </div>
      <div flex justify-between>
        <div v-if="meta.extra" flex gap-2 items-center>
          <div>
            <img w-6 aspect-square width="20" height="20" rounded-full :src="meta.extra?.author?.avatar">
          </div>
          <span text-xl text-primary font-bold>@{{ meta.extra?.author?.user }}</span>
        </div>
        <div v-else />
        <div text-2xl i-ri:github-fill text-secondary />
      </div>
    </div>
  </div>
</template>
