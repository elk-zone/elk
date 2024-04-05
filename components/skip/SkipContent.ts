// @unocss-include
import { accessKeys } from '~/constants/access-keys'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    return () => h('a', {
      id: 'skip',
      class: 'sr-only',
      href: '#skip-content',
      accesskey: accessKeys.SkipContent,
    }, t(`a11y.skip_navigation`))
  },
})
