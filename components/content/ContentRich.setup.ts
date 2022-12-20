import type { Emoji } from 'masto/fetch'
import { emojisArrayToObject } from '~/composables/utils'

defineOptions({
  name: 'ContentRich',
})

const { content, emojis, markdown = true } = defineProps<{
  content: string
  markdown?: boolean
  emojis?: Emoji[]
}>()

export default () => h(
  'span',
  { class: 'content-rich' },
  contentToVNode(content, {
    emojis: emojisArrayToObject(emojis || []),
    markdown,
  }),
)
