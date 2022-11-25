import { defineNuxtModule, useNuxt } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'setup-components',
  },
  setup() {
    const nuxt = useNuxt()
    nuxt.hook('components:extend', (components) => {
      for (const component of components) {
        component.pascalName = component.pascalName.replace(/Setup$/, '')
        component.kebabName = component.kebabName.replace(/-setup$/, '')
      }
    })
  },
})
