import type { Emoji } from 'masto'

defineOptions({
  name: 'ContentRich',
})

const {
  content,
  emojis,
  markdown = true,
} = defineProps<{
  content: string
  emojis?: Emoji[]
  markdown?: boolean
}>()

const emojisObject = useEmojisFallback(() => emojis)

export default () => h(
  'span',
  { class: 'content-rich', dir: 'auto' },
  contentToVNode(content, {
    emojis: emojisObject.value,
    markdown,
  }),
)
