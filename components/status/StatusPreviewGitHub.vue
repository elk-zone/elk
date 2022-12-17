<script setup lang="ts">
import type { Card } from 'masto'

const props = defineProps<{
  card: Card
}>()

const isSquare = false
const root = true

type UrlType = 'user' | 'repo' | 'issue' | 'pull'
interface Meta {
  type: UrlType
  user: string
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
    details,
    repo,
    number,
    avatar,
  })
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
    :class="{
      'sm:(min-w-32 w-32 h-32) min-w-22 w-22 h-22 border-r': isSquare,
      'w-full aspect-[1.91] border-b': !isSquare,
      'rounded-lg': root,
    }"
  >
    <div p4 px-6 flex flex-col justify-between h-full>
      <div flex justify-between items-center gap-8 h-full mb-2>
        <div flex flex-col gap-2>
          <a flex text-3xl flex-wrap :href="card.url">
            <p v-if="meta.repo" flex gap-1>
              <span>{{ meta.user }}</span><span text-secondary-light>/</span><span text-primary font-bold>{{ meta.repo }}</span>
            </p>
            <span v-else>{{ meta.user }}</span>
          </a>
          <div flex flex-col>
            <p v-if="meta.type === 'issue'" font-bold text-xl text-primary>
              Issue #{{ meta.number }}
            </p>
            <p v-if="meta.type === 'pull'" font-bold text-xl text-primary>
              PR #{{ meta.number }}
            </p>
            <span text-secondary-light leading-tight>{{ meta.details }}</span>
          </div>
        </div>
        <div>
          <img w-30 aspect-square width="20" height="20" rounded-2 :src="meta.avatar">
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
