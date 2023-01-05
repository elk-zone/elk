import { addPlugin, createResolver, defineNuxtModule, resolvePath } from '@nuxt/kit'
import { analyze } from 'periscopic'
import { parse, print, types } from 'recast'
import { attachComments } from 'estree-util-attach-comments'
import { getSafeName, parseQuery } from './utils'
import N = types.namedTypes

const n = types.namedTypes
const b = types.builders

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

    nuxt.hook('vite:extendConfig', async (config, { isClient }) => {
      // plugins should only run on client
      if (!isClient)
        return

      const manifests = new Map<string, SFCManifest>()

      // push right after `nuxt:imports-transform`, I just can't workaround auto-import
      const index = config.plugins!.findIndex(p => p && 'name' in p && p.name === 'nuxt:imports-transform')
      if (nuxt.options.dev) {
        const devManifestPath = await resolvePath(resolve('./runtime/devManifest'))
        config.plugins!.splice(index + 1, 0, {
          name: 'elk:plugin-transform:dev',
          enforce: 'post',
          transform(code, id) {
            const { path, params } = parseQuery(id)
            if (path.endsWith('.vue') && !params.has('vue')) {
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
              }) as N.File
              const p = ast.program

              // @ts-expect-error incompatible but same types
              const { map, scope } = analyze(p)

              const usedNames = new Set<string>(scope.references)

              const manifest: SFCManifest = {
                id: relativePath,
                setupRefs: [],
                setupDecls: [],
                renderRefs: [],
              }

              const _sfc_main = p.body
                .find((node): node is N.VariableDeclaration =>
                  n.VariableDeclaration.check(node)
                  && n.VariableDeclarator.check(node.declarations[0])
                  && n.Identifier.check(node.declarations[0].id)
                  && node.declarations[0].id.name === '_sfc_main')
              if (_sfc_main) {
                const _sfc_call = (_sfc_main.declarations[0] as N.VariableDeclarator).init
                const _sfc_options = n.ObjectExpression.check(_sfc_call)
                  ? _sfc_call
                  : n.CallExpression.check(_sfc_call) && n.ObjectExpression.check(_sfc_call.arguments[0])
                    ? _sfc_call.arguments[0]
                    : null
                if (!_sfc_options)
                  return

                const _sfc_setup = _sfc_options.properties
                  .find((prop): prop is N.Property =>
                    n.Property.check(prop)
                  && n.Identifier.check(prop.key)
                  && prop.key.name === 'setup')
                  ?.value as N.FunctionExpression | undefined

                if (_sfc_setup) {
                // @ts-expect-error incompatible but same types
                  const scope = map.get(_sfc_setup.body)!

                  // import { inject } from 'vue'
                  const vueImport = p.body
                    .find((node): node is N.ImportDeclaration =>
                      n.ImportDeclaration.check(node)
                    && node.source.value === 'vue')
                  const injectImport = vueImport?.specifiers
                    ?.find((specifier): specifier is N.ImportSpecifier =>
                      n.ImportSpecifier.check(specifier)
                    && specifier.imported.name === 'inject')
                  let injectIdentifier: N.Identifier
                  if (n.Identifier.check(injectImport?.local)) {
                    injectIdentifier = injectImport!.local
                  }
                  else {
                    injectIdentifier = b.identifier(getSafeName('inject', usedNames, null))
                    if (vueImport) {
                      vueImport.specifiers = vueImport.specifiers ?? []
                      vueImport.specifiers.push(b.importSpecifier(b.identifier('inject'), injectIdentifier))
                    }
                    else {
                      p.body.unshift(b.importDeclaration([
                        b.importSpecifier(b.identifier('inject'), injectIdentifier),
                      ], b.literal('vue')))
                    }
                  }

                  // const $elkPlugin = inject('$elkPlugin')
                  const elkPluginIdentifier = b.identifier(getSafeName('$elkPlugin', usedNames, null))
                  const elkPluginDecl = b.variableDeclaration('const', [
                    b.variableDeclarator(elkPluginIdentifier,
                      b.callExpression(injectIdentifier, [b.literal('$elkPlugin')])),
                  ])

                  // rewrite `const __returned__ = { _ctx, ... }` to
                  // const _elk_ret = $elkPlugin.setupDecl(id, [ _ctx, ... ])
                  // const __returned__ = { _ctx: _elk_ret[0], ... }
                  const returnedRet = _sfc_setup.body.body.at(-1)
                  if (returnedRet
                  && n.ReturnStatement.check(returnedRet)
                  && n.Identifier.check(returnedRet.argument)) {
                    const returnedIdent = returnedRet.argument
                    const returnedDeclIndex = _sfc_setup.body.body
                      .findIndex(node =>
                        n.VariableDeclaration.check(node)
                        && n.VariableDeclarator.check(node.declarations[0])
                        && n.Identifier.check(node.declarations[0].id)
                        && node.declarations[0].id.name === returnedIdent.name)!
                    const returnedInit = (
                      (_sfc_setup.body.body[returnedDeclIndex] as N.VariableDeclaration)
                        .declarations[0] as N.VariableDeclarator
                    ).init as N.ObjectExpression
                    const returnedProps = returnedInit.properties
                      .filter((prop): prop is N.Property =>
                        n.Property.check(prop)
                        && n.Identifier.check(prop.key))
                      .map(prop => (prop.key as N.Identifier).name)
                    manifest.setupDecls = returnedProps
                    const returnedRetIdent = b.identifier(getSafeName('_elk_ret', usedNames, null))
                    const returnedCallDecl = b.variableDeclaration('const', [
                      b.variableDeclarator(returnedRetIdent,
                        b.callExpression(
                          b.memberExpression(elkPluginIdentifier, b.identifier('setupDecl')),
                          [
                            b.literal(relativePath),
                            b.arrayExpression(returnedProps.map(name => b.identifier(name))),
                          ],
                        ),
                      ),
                    ])
                    const returnedDecl = b.variableDeclaration('const', [
                      b.variableDeclarator(returnedIdent,
                        b.objectExpression(returnedProps.map((name, i) => b.property(
                          'init',
                          b.identifier(name),
                          b.memberExpression(returnedRetIdent, b.numericLiteral(i), true),
                        ))),
                      ),
                    ])
                    _sfc_setup.body.body.splice(returnedDeclIndex, 1, returnedCallDecl, returnedDecl)
                  }

                  // @ts-expect-error incompatible but same types
                  const refs = [...analyze(_sfc_setup.body).globals.keys()]
                    .filter(ref => !scope.parent!.declarations.has(ref))
                  manifest.setupRefs = refs

                  // const _elk_refs = $elkPlugin.setupRef(id, arguments, [ ... ])
                  // {
                  //   const [ ... ] = _elk_refs
                  //   ...
                  // }
                  const refCall = b.callExpression(
                    b.memberExpression(elkPluginIdentifier, b.identifier('setupRef')),
                    [
                      b.literal(relativePath),
                      b.identifier('arguments'),
                      b.arrayExpression(refs.map(name => b.identifier(name))),
                    ],
                  )
                  const refIdentifier = b.identifier(getSafeName('_elk_refs', usedNames, null))
                  const refDecl = b.variableDeclaration('const', [
                    b.variableDeclarator(refIdentifier, refCall),
                  ])
                  const refBlock = b.blockStatement([
                    b.variableDeclaration('let', [
                      b.variableDeclarator(
                        b.arrayPattern(refs.map(name => b.identifier(name))),
                        refIdentifier,
                      ),
                    ]),
                    ..._sfc_setup.body.body,
                  ])
                  _sfc_setup.body.body = [
                    elkPluginDecl,
                    refDecl,
                    refBlock,
                  ]
                }
              }

              const _sfc_render = p.body
                .find((node): node is N.FunctionDeclaration =>
                  n.FunctionDeclaration.check(node)
                  && n.Identifier.check(node.id)
                  && node.id.name === '_sfc_render')
              if (_sfc_render) {
              // @ts-expect-error incompatible but same types
                const scope = map.get(_sfc_render.body)!

                // _ctx.$options.$elkPlugin
                const elkPluginHook = b.memberExpression(
                  b.memberExpression(
                    _sfc_render.params[0] as N.Identifier,
                    b.identifier('$options'),
                  ),
                  b.identifier('$elkPlugin'),
                )

                // @ts-expect-error incompatible but same types
                const refs = [...analyze(_sfc_render.body).globals.keys()]
                  .filter(ref => !scope.parent!.declarations.has(ref))

                // pass through auto-imported components
                const components: N.VariableDeclaration[] = []
                _sfc_render.body.body = _sfc_render.body.body
                  .filter((node) => {
                    if (n.VariableDeclaration.check(node)
                    && node.declarations.length === 1
                    && n.VariableDeclarator.check(node.declarations[0])
                    && n.Identifier.check(node.declarations[0].id)
                    && node.declarations[0].id.name.startsWith('_component_')) {
                      components.push(node)
                      refs.push(node.declarations[0].id.name)
                      return false
                    }
                    return true
                  })

                manifest.renderRefs = refs

                // const _elk_refs = _ctx.$options.$elkPlugin.renderRef(id, arguments, [ ... ])
                // {
                //   const [ ... ] = _elk_refs
                //   ...
                // }
                const refCall = b.callExpression(
                  b.memberExpression(
                    elkPluginHook,
                    b.identifier('renderRef'),
                  ),
                  [
                    b.literal(relativePath),
                    b.identifier('arguments'),
                    b.arrayExpression(refs.map(name => b.identifier(name))),
                  ],
                )
                const refIdentifier = b.identifier(getSafeName('_elk_refs', usedNames, null))
                const refDecl = b.variableDeclaration('const', [
                  b.variableDeclarator(refIdentifier, refCall),
                ])
                const refBlock = b.blockStatement([
                  b.variableDeclaration('let', [
                    b.variableDeclarator(
                      b.arrayPattern(refs.map(name => b.identifier(name))),
                      refIdentifier,
                    ),
                  ]),
                  ..._sfc_render.body.body,
                ])
                _sfc_render.body.body = [
                  ...components,
                  refDecl,
                  refBlock,
                ]
              }

              // import { provideManifest } from './runtime/devManifest'
              // provideManifest(id, manifest)
              const provideIdent = b.identifier(getSafeName('provideManifest', usedNames, null))
              const provideDecl = b.importDeclaration(
                [b.importSpecifier(provideIdent, provideIdent)],
                b.literal(devManifestPath),
              )
              const provideCall = b.expressionStatement(
                b.callExpression(provideIdent, [
                  b.literal(relativePath),
                  b.callExpression(
                    b.memberExpression(b.identifier('JSON'), b.identifier('parse')),
                    [b.literal(JSON.stringify(manifest))],
                  ),
                ]),
              )

              if (_sfc_main) {
                const index = p.body.indexOf(_sfc_main)
                p.body.splice(index, 0, provideDecl, provideCall)
              }
              else if (_sfc_render) {
                const index = p.body.indexOf(_sfc_render)
                p.body.splice(index, 0, provideDecl, provideCall)
              }
              else {
                p.body.push(provideDecl, provideCall)
              }

              const res = print(ast)

              manifests.set(relativePath, manifest)

              return {
                code: res.code,
                map: res.map,
              }
            }
          },
        })
      }
    })

    addPlugin(resolve('./runtime/plugin'))
  },
})
