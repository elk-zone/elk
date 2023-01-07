<script setup lang="ts">
import type { Card } from 'masto'
import type { StatusQuote } from '~~/composables/status-quote'

const props = defineProps<{
  card: Card
}>()

/**
 *  TODO:
 * - extract username
 * - generate user profile link
 * - quotation icon ?
*/

/*

{
  "url": "https://hachyderm.io/@hi_mayank/109638087773020859",
  "title": "Mayank :verified: (@hi_mayank@hachyderm.io)",
  "description": "this article from @ben@a11y.info is of course excellent https://benmyers.dev/blog/semantic-selectors/\n\nhowever, in practice, i have found myself unable to fully utilize this approach....\n\ntwo examples:\n\n1. an input with a disabled/required attribute can be styled by targeting `:disabled` or `:required` but styling its label probably needs a data attribute or class\n\n2. vertical tabs can be styled by targeting `aria-orientation` but its content or wrapper probably needs a data attribute or class.\n\n(cont...)",
  "type": "link",
  "author_name": "",
  "author_url": "",
  "provider_name": "Hachyderm.io",
  "provider_url": "",
  "html": "",
  "width": 400,
  "height": 400,
  "image": "https://media.mas.to/masto-public/cache/preview_cards/images/017/761/272/original/e8ce83dfa2e4c64d.jpeg",
  "embed_url": "",
  "blurhash": "UREyiOM{-=D%_4IURiRjRiWBM{%M%NRjWCWA"
}

*/

// build the Status from Card
const card = $computed(() => props.card)
const usernames = card.title.match(/@+[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi)
const fullUserName = usernames?.length && usernames[0]
let username, domain
if (fullUserName) {
  username = fullUserName.split('@')[1]
  domain = fullUserName.split('@')[2]
}
const isSquare = card.width === card.height
const avatar = isSquare ? card.image : '' // todo: default avatar
const status: StatusQuote = {
  id: '',
  uri: '',
  createdAt: '',
  editedAt: null,
  account: {
    username: username || '',
    displayName: 'FAKE NAME', // todo update
    avatar: avatar || '',
  },
}
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
          <a flex gap-1 text-sm flex-wrap leading-none :href="card.url" target="_blank">
            <span>{{ card.title }}</span>
          </a>
          <a sm:text-lg :href="card.url" target="_blank">
            <span text-secondary leading-tight>{{ card.description }}</span>
          </a>
        </div>
        <div>
          <a :href="card.url" target="_blank">
            <img w-30 aspect-square width="20" height="20" rounded-2 :src="card.image">
          </a>
        </div>
      </div>
      <div flex justify-between>
        <div />
        <div text-2xl i-ri:mastodon-fill text-secondary />
      </div>
    </div>
  </div>
</template>
