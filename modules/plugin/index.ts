import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type estree from 'estree'
import { analyze } from 'periscopic'
import { generate } from 'astring'
import { SourceMapGenerator } from 'source-map-js'
import { getSafeName, parseQuery } from './utils'

export default defineNuxtModule({
  meta: {
    name: 'elk-plugin',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      // plugins should only run on client
      if (!isClient)
        return

      // push right after `nuxt:imports-transform`, I just can't workaround auto-import
      const index = config.plugins!.findIndex(p => p && 'name' in p && p.name === 'nuxt:imports-transform')
      config.plugins!.splice(index + 1, 0, {
        name: 'elk:plugin-transform',
        enforce: 'post',
        transform(code, id) {
          const { path, params } = parseQuery(id)
          if (path.endsWith('.vue') && (params.has('vue') ? params.get('type') === 'script' : true)) {
            const relativePath = path.replace(nuxt.options.rootDir, '')

            const ast = this.parse(code, {
              sourceType: 'module',
              locations: true,
            }) as unknown as estree.Program

            const { map, scope } = analyze(ast)

            const usedNames = new Set<string>(scope.references)

            const _sfc_main = ast.body
              .find((node): node is estree.VariableDeclaration =>
                node.type === 'VariableDeclaration'
                  && node.declarations[0]?.id?.type === 'Identifier'
                  && node.declarations[0].id.name === '_sfc_main')
            if (_sfc_main) {
              const _sfc_call = _sfc_main.declarations[0].init as estree.CallExpression | estree.ObjectExpression
              const _sfc_options = _sfc_call.type === 'ObjectExpression'
                ? _sfc_call
                : _sfc_call.arguments[0] as estree.ObjectExpression
              const _sfc_setup = _sfc_options.properties.find((prop): prop is estree.Property =>
                prop.type === 'Property' && prop.key.type === 'Identifier' && prop.key.name === 'setup')
                ?.value as estree.FunctionExpression | undefined

              if (_sfc_setup) {
                const scope = map.get(_sfc_setup.body)!

                // import { inject } from 'vue'
                const vueImport = ast.body.find((node): node is estree.ImportDeclaration =>
                  node.type === 'ImportDeclaration' && node.source.value === 'vue')
                const injectImport = vueImport?.specifiers.find((specifier): specifier is estree.ImportSpecifier =>
                  specifier.type === 'ImportSpecifier' && specifier.imported.name === 'inject')
                let injectIdentifier: estree.Identifier
                if (injectImport) {
                  injectIdentifier = injectImport.local
                }
                else {
                  injectIdentifier = {
                    type: 'Identifier',
                    name: getSafeName('inject', usedNames, null),
                  }
                  if (vueImport) {
                    vueImport.specifiers.push({
                      type: 'ImportSpecifier',
                      imported: {
                        type: 'Identifier',
                        name: 'inject',
                      },
                      local: injectIdentifier,
                    })
                  }
                  else {
                    ast.body.unshift({
                      type: 'ImportDeclaration',
                      specifiers: [{
                        type: 'ImportSpecifier',
                        imported: {
                          type: 'Identifier',
                          name: 'inject',
                        },
                        local: injectIdentifier,
                      }],
                      source: {
                        type: 'Literal',
                        value: 'vue',
                      },
                    })
                  }
                }

                // const $elkPlugin = inject('$elkPlugin')
                const elkPluginIdentifier: estree.Identifier = {
                  type: 'Identifier',
                  name: getSafeName('$elkPlugin', usedNames, null),
                }
                const elkPluginDecl: estree.VariableDeclaration = {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: elkPluginIdentifier,
                    init: {
                      type: 'CallExpression',
                      callee: injectIdentifier,
                      arguments: [{
                        type: 'Literal',
                        value: '$elkPlugin',
                      }],
                      optional: false,
                    },
                  }],
                }

                const refs = [...analyze(_sfc_setup.body).globals.keys()]
                  .filter(ref => !scope.parent!.declarations.has(ref))

                // const _elk_refs = $elkPlugin.setupRef(id, arguments, { _ctx })
                // {
                //   const { _ctx } = _elk_refs
                //   ...
                // }
                const refCall: estree.CallExpression = {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: elkPluginIdentifier,
                    property: {
                      type: 'Identifier',
                      name: 'setupRef',
                    },
                    computed: false,
                    optional: false,
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: relativePath,
                    },
                    {
                      type: 'Identifier',
                      name: 'arguments',
                    },
                    {
                      type: 'ObjectExpression',
                      properties: refs.map(name => ({
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name,
                        },
                        value: {
                          type: 'Identifier',
                          name,
                        },
                        kind: 'init',
                        method: false,
                        shorthand: true,
                        computed: false,
                      })),
                    },
                  ],
                  optional: false,
                }
                const refIdentifier: estree.Identifier = {
                  type: 'Identifier',
                  name: getSafeName('_elk_refs', usedNames, null),
                }
                const refDecl: estree.VariableDeclaration = {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: refIdentifier,
                      init: refCall,
                    },
                  ],
                }
                const refBlock: estree.BlockStatement = {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [{
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: refs.map(name => ({
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name,
                            },
                            value: {
                              type: 'Identifier',
                              name,
                            },
                            kind: 'init',
                            method: false,
                            shorthand: true,
                            computed: false,
                          })),
                        },
                        init: refIdentifier,
                      }],
                    },
                    ..._sfc_setup.body.body,
                  ],
                }
                _sfc_setup.body.body = [
                  elkPluginDecl,
                  refDecl,
                  refBlock,
                ]
              }
            }

            const _sfc_render = ast.body
              .find((node): node is estree.FunctionDeclaration =>
                node.type === 'FunctionDeclaration' && node.id?.name === '_sfc_render')
            if (_sfc_render) {
              const scope = map.get(_sfc_render.body)!

              const elkPluginHook: estree.Expression = {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: _sfc_render.params[0] as estree.Identifier,
                  property: {
                    type: 'Identifier',
                    name: '$options',
                  },
                  computed: false,
                  optional: false,
                },
                property: {
                  type: 'Identifier',
                  name: '$elkPlugin',
                },
                computed: false,
                optional: false,
              }

              const refs = [...analyze(_sfc_render.body).globals.keys()]
                .filter(ref => !scope.parent!.declarations.has(ref))

              const components: estree.VariableDeclaration[] = []
              _sfc_render.body.body = _sfc_render.body.body.filter((node) => {
                if (node.type === 'VariableDeclaration'
                  && node.declarations.length === 1
                  && node.declarations[0].id.type === 'Identifier'
                  && node.declarations[0].id.name.startsWith('_component_')) {
                  components.push(node)
                  refs.push(node.declarations[0].id.name)
                  return false
                }
                return true
              })

              // const _elk_refs = _ctx.$options.$elkPlugin.renderRef(id, arguments, { _ctx })
              // {
              //   const { _ctx } = _elk_refs
              //   ...
              // }
              const refCall: estree.CallExpression = {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: elkPluginHook,
                  property: {
                    type: 'Identifier',
                    name: 'renderRef',
                  },
                  computed: false,
                  optional: false,
                },
                arguments: [
                  {
                    type: 'Literal',
                    value: relativePath,
                  },
                  {
                    type: 'Identifier',
                    name: 'arguments',
                  },
                  {
                    type: 'ObjectExpression',
                    properties: refs.map(name => ({
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name,
                      },
                      value: {
                        type: 'Identifier',
                        name,
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true,
                      computed: false,
                    })),
                  },
                ],
                optional: false,
              }
              const refIdentifier: estree.Identifier = {
                type: 'Identifier',
                name: getSafeName('_elk_refs', usedNames, null),
              }
              const refDecl: estree.VariableDeclaration = {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: refIdentifier,
                    init: refCall,
                  },
                ],
              }
              const refBlock: estree.BlockStatement = {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [{
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
                        properties: refs.map(name => ({
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name,
                          },
                          value: {
                            type: 'Identifier',
                            name,
                          },
                          kind: 'init',
                          method: false,
                          shorthand: true,
                          computed: false,
                        })),
                      },
                      init: refIdentifier,
                    }],
                  },
                  ..._sfc_render.body.body,
                ],
              }
              _sfc_render.body.body = [
                ...components,
                refDecl,
                refBlock,
              ]
            }

            const sourceMap = new SourceMapGenerator({
              file: id,
            })
            const res = generate(ast, {
              sourceMap,
              comments: true,
            })

            return {
              code: res,
              map: sourceMap.toString(),
            }
          }
        },
      })
    })

    addPlugin(resolve('./runtime/plugin'))
  },
})
