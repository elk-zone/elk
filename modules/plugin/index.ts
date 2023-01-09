import { dirname } from 'node:path'
import { addPlugin, createResolver, defineNuxtModule, resolvePath } from '@nuxt/kit'
import { analyze } from 'periscopic'
import { Type } from 'ast-types'
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

const exportSpecifier = (exported: N.ExportSpecifier['exported'], local: N.ExportSpecifier['local']) =>
  b.exportSpecifier.from({ exported, local })

const isExpression = (stat: N.Statement): stat is NonNullable<N.VariableDeclarator['init']> =>
  Object.keys(Type.def('Expression').allSupertypes).includes(stat.type)

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
        const hookPath = await resolvePath(resolve('./runtime/hook'))

        const composableDirs = [
          './composables',
        ]
        if (nuxt.options.imports.dirs)
          composableDirs.push(...nuxt.options.imports.dirs)
        for (let i = 0; i < composableDirs.length; i++)
          composableDirs[i] = await resolvePath(composableDirs[i])

        config.plugins!.splice(index + 1, 0, {
          name: 'elk:plugin-transform:dev',
          enforce: 'post',
          transform(code, id) {
            const { path, params } = parseQuery(id)
            if (composableDirs.includes(dirname(path)) && path.endsWith('.ts')) {
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
              const { scope } = analyze(p)

              const usedNames = new Set<string>(scope.references)

              const hooks: Map<string, N.Identifier> = new Map()
              const useHook = (name: string) => {
                if (hooks.has(name))
                  return hooks.get(name)!

                const safeName = getSafeName(name, usedNames, null)
                const id = b.identifier(safeName)

                hooks.set(name, id)
                return id
              }

              for (let i = 0; i < p.body.length; i++) {
                const stat = p.body[i]
                // /*#__PURE__*/ autoImportDecl(path, 'name', init)
                const autoImportDecl = (name: string, init: N.VariableDeclarator['init']) => {
                  const call = b.callExpression(useHook('autoImportDecl'), [
                    b.literal(relativePath),
                    b.literal(name),
                    init ?? b.identifier('undefined'),
                  ])
                  call.comments ??= []
                  call.comments.push(b.commentBlock('#__PURE__', true, false))
                  return call
                }
                if (n.ExportNamedDeclaration.check(stat)) {
                  // replace `export const foo = bar`
                  // with
                  // const foo = bar
                  // const foo$1 = /*#__PURE__*/ autoImportDecl(path, 'foo', foo)
                  // export { foo$1 as foo }
                  if (n.VariableDeclaration.check(stat.declaration)) {
                    const decls: N.VariableDeclarator[] = []
                    stat.declaration.declarations = stat.declaration.declarations
                      .filter((decl) => {
                        if (n.VariableDeclarator.check(decl) && n.Identifier.check(decl.id)) {
                          decls.push(decl)
                          return false
                        }
                        return true
                      })
                    if (stat.declaration.declarations.length === 0)
                      p.body.splice(i, 1)
                    else
                      i++

                    if (decls.length) {
                      const origDecl = b.variableDeclaration(stat.declaration.kind, decls)
                      const declMap: Record<string, N.Identifier> = Object.fromEntries(decls.map(decl => [
                        (decl.id as N.Identifier).name,
                        b.identifier(getSafeName((decl.id as N.Identifier).name, usedNames, null)),
                      ]))
                      const newDecl = b.variableDeclaration(stat.declaration.kind, decls.map((decl) => {
                        const id = decl.id as N.Identifier
                        const newId = declMap[id.name]
                        return b.variableDeclarator(newId, autoImportDecl(id.name, id))
                      }))
                      const exp = b.exportDeclaration(false, null, decls.map(decl =>
                        exportSpecifier(decl.id as N.Identifier, declMap[(decl.id as N.Identifier).name])))
                      p.body.splice(i, 0, origDecl, newDecl, exp)
                      i += 2
                    }
                  }
                  // replace `export function foo() {}`
                  // with
                  // function foo() {}
                  // const foo$1 = /*#__PURE__*/ autoImportDecl(path, 'foo', foo)
                  // export { foo$1 as foo }
                  else if (n.FunctionDeclaration.check(stat.declaration)
                  || n.ClassDeclaration.check(stat.declaration)) {
                    const func = stat.declaration
                    const declId = b.identifier(getSafeName(func.id!.name, usedNames, null))
                    const decl = b.variableDeclaration('const', [
                      b.variableDeclarator(
                        declId,
                        autoImportDecl(func.id!.name, b.identifier(func.id!.name)),
                      ),
                    ])
                    p.body.splice(i, 0, func, decl)
                    i += 2
                    stat.declaration = null
                    stat.specifiers = [exportSpecifier(func.id!, declId)]
                  }
                  // replace `export { foo as bar }`
                  // with
                  // const bar$1 = /*#__PURE__*/ autoImportDecl(path, 'bar', foo)
                  // export { bar$1 as bar }
                  else if (stat.specifiers) {
                    stat.specifiers = stat.specifiers.map((spec) => {
                      const declId = b.identifier(getSafeName(spec.exported.name, usedNames, null))
                      const decl = b.variableDeclaration('const', [
                        b.variableDeclarator(
                          declId,
                          autoImportDecl(spec.exported.name, b.identifier((spec.local ?? spec.exported).name)),
                        ),
                      ])
                      p.body.splice(i, 0, decl)
                      i++
                      return exportSpecifier(spec.exported, declId)
                    })
                  }
                }
                else if (n.ExportDefaultDeclaration.check(stat)) {
                  // replace `export default foo`
                  // with
                  // const default = foo
                  // export default /*#__PURE__*/ autoImportDecl(path, 'default', default)
                  if (isExpression(stat.declaration)) {
                    const declId = b.identifier(getSafeName('default', usedNames, null))
                    const decl = b.variableDeclaration('const', [
                      b.variableDeclarator(declId, stat.declaration),
                    ])
                    p.body.splice(i, 0, decl)
                    i++
                    stat.declaration = autoImportDecl('default', declId)
                  }
                  else {
                    // replace `export default function foo() {}`
                    // with
                    // function foo() {}
                    // const foo$1 = /*#__PURE__*/ autoImportDecl(path, 'default', foo)
                    // export default foo$1
                    if (n.FunctionDeclaration.check(stat.declaration)
                    || n.ClassDeclaration.check(stat.declaration)) {
                      const func = stat.declaration
                      func.id = func.id ?? b.identifier(getSafeName('default', usedNames, null))
                      const declId = b.identifier(getSafeName(func.id.name, usedNames, null))
                      const decl = b.variableDeclaration('const', [
                        b.variableDeclarator(declId, autoImportDecl('default', func.id)),
                      ])
                      p.body.splice(i, 0, func, decl)
                      i += 2
                      stat.declaration = declId
                    }
                  }
                }
              }

              // import hooks from './runtime/hook'
              const hookImport = b.importDeclaration(
                Array.from(hooks)
                  .map(([name, id]) => b.importSpecifier(
                    b.identifier(name),
                    id,
                  )),
                b.literal(hookPath),
              )

              p.body.unshift(hookImport)

              const res = print(ast)

              return {
                code: res.code,
                map: res.map,
              }
            }
            else if (path.endsWith('.vue') && !params.has('vue')) {
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

              const hooks: Map<string, N.Identifier> = new Map()
              const useHook = (name: string) => {
                if (hooks.has(name))
                  return hooks.get(name)!

                const safeName = getSafeName(name, usedNames, null)
                const id = b.identifier(safeName)

                hooks.set(name, id)
                return id
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

                  // rewrite `const __returned__ = { _ctx, ... }` to
                  // const _elk_ret = setupDecl(id, [ _ctx, ... ])
                  // const __returned__ = { _ctx: _elk_ret[0], ... }
                  const returnedRet = _sfc_setup.body.body.at(-1)
                  if (returnedRet
                  && n.ReturnStatement.check(returnedRet)
                  && n.Identifier.check(returnedRet.argument)) {
                    const returnedId = returnedRet.argument
                    const returnedDeclIndex = _sfc_setup.body.body
                      .findIndex(node =>
                        n.VariableDeclaration.check(node)
                        && n.VariableDeclarator.check(node.declarations[0])
                        && n.Identifier.check(node.declarations[0].id)
                        && node.declarations[0].id.name === returnedId.name)!
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
                    const returnedRetId = b.identifier(getSafeName('_elk_ret', usedNames, null))
                    const returnedCallDecl = b.variableDeclaration('const', [
                      b.variableDeclarator(returnedRetId,
                        b.callExpression(
                          useHook('setupDecl'),
                          [
                            b.literal(relativePath),
                            b.arrayExpression(returnedProps.map(name => b.identifier(name))),
                          ],
                        ),
                      ),
                    ])
                    const returnedDecl = b.variableDeclaration('const', [
                      b.variableDeclarator(returnedId,
                        b.objectExpression(returnedProps.map((name, i) => b.property(
                          'init',
                          b.identifier(name),
                          b.memberExpression(returnedRetId, b.numericLiteral(i), true),
                        ))),
                      ),
                    ])
                    _sfc_setup.body.body.splice(returnedDeclIndex, 1, returnedCallDecl, returnedDecl)
                  }

                  // @ts-expect-error incompatible but same types
                  const refs = [...analyze(_sfc_setup.body).globals.keys()]
                    .filter(ref => !scope.parent!.declarations.has(ref))
                  manifest.setupRefs = refs

                  // const _elk_refs = setupRef(id, arguments, [ ... ])
                  // {
                  //   const [ ... ] = _elk_refs
                  //   ...
                  // }
                  const refCall = b.callExpression(
                    useHook('setupRef'),
                    [
                      b.literal(relativePath),
                      b.identifier('arguments'),
                      b.arrayExpression(refs.map(name => b.identifier(name))),
                    ],
                  )
                  const refId = b.identifier(getSafeName('_elk_refs', usedNames, null))
                  const refDecl = b.variableDeclaration('const', [
                    b.variableDeclarator(refId, refCall),
                  ])
                  const refBlock = b.blockStatement([
                    b.variableDeclaration('let', [
                      b.variableDeclarator(
                        b.arrayPattern(refs.map(name => b.identifier(name))),
                        refId,
                      ),
                    ]),
                    ..._sfc_setup.body.body,
                  ])
                  _sfc_setup.body.body = [
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

                // @ts-expect-error incompatible but same types
                const refs = [...analyze(_sfc_render.body).globals.keys()]
                  .filter(ref => !scope.parent!.declarations.has(ref))
                  .filter(ref => !ref.startsWith('_hoisted_'))

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

                // const _elk_refs = renderRef(id, arguments, [ ... ])
                // {
                //   const [ ... ] = _elk_refs
                //   ...
                // }
                const refCall = b.callExpression(
                  useHook('renderRef'),
                  [
                    b.literal(relativePath),
                    b.identifier('arguments'),
                    b.arrayExpression(refs.map(name => b.identifier(name))),
                  ],
                )
                const refId = b.identifier(getSafeName('_elk_refs', usedNames, null))
                const refDecl = b.variableDeclaration('const', [
                  b.variableDeclarator(refId, refCall),
                ])
                const refBlock = b.blockStatement([
                  b.variableDeclaration('let', [
                    b.variableDeclarator(
                      b.arrayPattern(refs.map(name => b.identifier(name))),
                      refId,
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

              // import hooks from './runtime/hook'
              const hookImport = b.importDeclaration(
                Array.from(hooks)
                  .map(([name, id]) => b.importSpecifier(
                    b.identifier(name),
                    id,
                  )),
                b.literal(hookPath),
              )

              // import { provideManifest } from './runtime/devManifest'
              // provideManifest(id, manifest)
              const provideId = b.identifier(getSafeName('provideManifest', usedNames, null))
              const provideDecl = b.importDeclaration(
                [b.importSpecifier(provideId, provideId)],
                b.literal(devManifestPath),
              )
              const provideCall = b.expressionStatement(
                b.callExpression(provideId, [
                  b.literal(relativePath),
                  b.callExpression(
                    b.memberExpression(b.identifier('JSON'), b.identifier('parse')),
                    [b.literal(JSON.stringify(manifest))],
                  ),
                ]),
              )

              if (_sfc_main) {
                const index = p.body.indexOf(_sfc_main)
                p.body.splice(index, 0, provideCall)
              }
              else if (_sfc_render) {
                const index = p.body.indexOf(_sfc_render)
                p.body.splice(index, 0, provideCall)
              }
              else {
                p.body.push(provideCall)
              }

              p.body.unshift(hookImport, provideDecl)

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
