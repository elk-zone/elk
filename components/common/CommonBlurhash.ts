import { decode } from 'blurhash'
import { getDataUrlFromArr } from '~~/composables/utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    blurhash: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const placeholderSrc = ref<string>()
    const isLoaded = ref(false)

    onMounted(() => {
      const img = document.createElement('img')
      img.onload = () => {
        isLoaded.value = true
      }
      img.src = props.src
      setTimeout(() => {
        isLoaded.value = true
      }, 3_000)

      if (props.blurhash) {
        const pixels = decode(props.blurhash, 32, 32)
        placeholderSrc.value = getDataUrlFromArr(pixels, 32, 32)
      }
    })

    return () => isLoaded.value || !placeholderSrc.value
      ? h('img', { ...attrs, src: props.src })
      : h('img', { ...attrs, src: placeholderSrc.value })
  },
})
