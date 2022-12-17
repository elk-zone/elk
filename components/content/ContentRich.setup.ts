import type { Emoji } from 'masto'
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
