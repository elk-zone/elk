<script lang="ts">
import type { mastodon } from 'masto'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'ContentRich',
  props: {
    content: {
      type: String,
      required: true,
    },
    emojis: {
      type: Array as PropType<mastodon.v1.CustomEmoji[]>,
      default: undefined,
    },
    hideEmojis: {
      type: Boolean,
      default: false,
    },
    markdown: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const emojisObject = useEmojisFallback(() => props.emojis)

    return () => h(
      'span',
      { class: 'content-rich', dir: 'auto' },
      contentToVNode(props.content, {
        emojis: emojisObject.value,
        hideEmojis: props.hideEmojis,
        markdown: props.markdown,
      }),
    )
  },
})
</script>
