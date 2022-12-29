import type { Emoji } from 'masto'

defineOptions({
  name: 'ContentRich',
})

const { content, emojis, markdown = true } = defineProps<{
  content: string
  markdown?: boolean
  emojis?: Emoji[]
}>()

const useEmojis = computed(() => {
  const result: Emoji[] = []
  if (emojis)
    result.push(...emojis)

  result.push(...currentCustomEmojis.value.emojis)

  return emojisArrayToObject(result)
})

export default () => h(
  'span',
  { class: 'content-rich' },
  contentToVNode(content, {
    emojis: useEmojis.value,
    markdown,
  }),
)
