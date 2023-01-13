import { defineElkPlugin } from '../kit'

// TODO fix indent
export default defineElkPlugin<{
  afterColorMode(): void
}>({
      name: 'test',
      transform(ctx) {
        ctx.mixin('/components/settings/SettingsColorMode.vue')
          .inject({
            type: 'ImportedCallExpression',
            method: 'useColorMode',
            after: true,
          }, 'afterColorMode')
      },
      setup(ctx) {
        ctx.onHook('afterColorMode', () => {
          console.log('afterColorMode')
        })
      },
    })
