import type { akkoma } from 'akko'

defineOptions({
  name: 'ContentRich',
})

const {
  content,
  emojis,
  hideEmojis = false,
  markdown = true,
} = defineProps<{
  content: string
  emojis?: akkoma.v1.CustomEmoji[]
  hideEmojis?: boolean
  markdown?: boolean
}>()

const emojisObject = useEmojisFallback(() => emojis)

export default () => h(
  'span',
  { class: 'content-rich', dir: 'auto' },
  contentToVNode(content, {
    emojis: emojisObject.value,
    hideEmojis,
    markdown,
  }),
)
