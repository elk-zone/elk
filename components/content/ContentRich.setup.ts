import type { Emoji } from 'masto'
import { emojisArrayToObject } from '~/composables/utils'

defineOptions({
  name: 'ContentRich',
})

const props = defineProps<{
  content: string
  emojis?: Emoji[]
}>()

export default () => h(
  'span',
  { class: 'content-rich' },
  contentToVNode(props.content, emojisArrayToObject(props.emojis || [])),
)
