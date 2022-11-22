import type { Emoji } from 'masto'
import type { PropType } from 'vue'
import { emojisArrayToObject } from '~/composables/utils'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    emojis: {
      type: Array as PropType<Emoji[]>,
    },
  },
  setup(props) {
    const emojiObject = emojisArrayToObject(props.emojis || [])

    return () => h(
      'div',
      { class: 'rich-content' },
      contentToVNode(props.content, undefined, emojiObject),
    )
  },
})
