import { addPlugin, addVitePlugin, createResolver, defineNuxtModule, resolvePath } from '@nuxt/kit'
import { analyze } from 'periscopic'
import { parse, print, types } from 'recast'
import { attachComments } from 'estree-util-attach-comments'
import { getSafeName, parseQuery } from './utils'
import testPlugin from './example/test'
import { TransformContext } from './kit/transform'
import n = types.namedTypes

export interface SFCManifest {
  id: string
  setupRefs: string[]
  setupDecls: string[]
  renderRefs: string[]
}

export default defineNuxtModule({
  meta: {
    name: 'elk-plugin',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const composableDirs = [
      './composables',
    ]
    if (nuxt.options.imports.dirs)
      composableDirs.push(...nuxt.options.imports.dirs)
    for (let i = 0; i < composableDirs.length; i++)
      composableDirs[i] = await resolvePath(composableDirs[i])

    const context = new TransformContext()
    testPlugin.transform?.(context)

    addVitePlugin({
      name: 'elk:plugin-transform:dev',
      enforce: 'post',
      transform(code, id) {
        const { path, params } = parseQuery(id)

        if (!path.endsWith('.ts') && (!path.endsWith('.vue') || params.has('vue')))
          return

        const relativePath = path.replace(nuxt.options.rootDir, '')

        const ast = parse(code, {
          parser: {
            parse: (source: string) => {
              const comments: never[] = []
              const tree = this.parse(source, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                onComment: comments,
              })
              attachComments(tree, comments)
              return tree
            },
          },
        }) as n.File
        const p = ast.program

        // TODO
        const dirty = true

        // @ts-expect-error incompatible but same types
        const periscopic = analyze(p)
        const { scope } = periscopic

        const usedNames = new Set<string>(scope.references)

        context.transformAST.trigger({
          id: relativePath,
          ast,
          periscopic,
          usedNames,
          getSafeName: (baseName, forbiddenNames) => getSafeName(baseName, usedNames, forbiddenNames),
        })

        if (dirty) {
          const res = print(ast)
          return {
            code: res.code,
            map: res.map,
          }
        }
      },
    }, { client: true, server: false })

    addPlugin(resolve('./runtime/plugin'))
  },
})
