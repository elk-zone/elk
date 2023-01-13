import { types } from 'recast'
import { walk } from 'estree-walker'
import type { TransformASTPayload } from '../transform'
import type { ElkPluginHooks } from '..'
import type { MixinInjectLoc } from './loc'
import n = types.namedTypes

const b = types.builders

export type OnASTCallback = (payload: TransformASTPayload) => any

export class Mixin<
  Hooks extends ElkPluginHooks,
> {
  private file
  private onAST
  constructor(
    file: string,
    onAST: (cb: OnASTCallback) => void,
  ) {
    this.file = file
    this.onAST = onAST
  }

  get id() {
    return this.file
  }

  createHookCall<
    H extends Extract<keyof Hooks, string>,
  >(hook: H, ...args: Parameters<typeof b['callExpression']>[1]) {
    return b.callExpression(
      b.memberExpression(
        b.memberExpression(
          b.identifier('globalThis'),
          b.identifier('__ep_t'),
        ),
        b.identifier('emit'),
      ),
      [
        b.literal(hook),
        ...args,
      ],
    )
  }

  inject<
    H extends Extract<keyof Hooks, string>,
  >(loc: MixinInjectLoc, hook: H) {
    this.onAST(({ ast, periscopic: { map }, getSafeName }) => {
      const createHookCall = this.createHookCall.bind(this, hook)
      switch (loc.type) {
        case 'ImportedCallExpression': {
          let importId: n.Identifier
          const stack: n.Node[] = []
          const matchedNodes = new WeakSet()
          walk(ast, {
            enter(node) {
              stack.push(node)
              if (matchedNodes.has(node))
                return
              if (n.ImportSpecifier.check(node) && node.imported.name === loc.method) {
                const local = node.local ?? node.imported
                if (n.Identifier.check(local))
                  importId = local
              }
              else if (n.BlockStatement.check(node)) {
                // @ts-expect-error incompatible but same types
                if (map.get(node)?.declarations.has(importId.name))
                  this.skip()
              }
              else if (n.CallExpression.check(node)) {
                if (n.Identifier.check(node.callee) && node.callee.name === importId.name) {
                  matchedNodes.add(node)
                  if (loc.before) {
                    const comma = b.sequenceExpression([
                      createHookCall(),
                      node,
                    ])
                    this.replace(comma)
                  }
                  else if (loc.after) {
                    // find a place in stack that can declare a variable
                    let block: n.BlockStatement | n.Program | undefined
                    for (let i = stack.length - 1; i >= 0; i--) {
                      const node = stack[i]
                      if (n.BlockStatement.check(node) || n.Program.check(node)) {
                        block = node
                        break
                      }
                      else if (n.FunctionExpression.check(node)
                      || n.FunctionDeclaration.check(node)
                      || n.ForStatement.check(node)
                      || n.ForInStatement.check(node)
                      || n.ForOfStatement.check(node)
                      || n.CatchClause.check(node)) {
                        node.body = block = b.blockStatement([node.body])
                        break
                      }
                      else if (n.ArrowFunctionExpression.check(node)) {
                        node.body = block = b.blockStatement([
                          b.returnStatement(node.body as Exclude<n.ArrowFunctionExpression['body'], n.BlockStatement>),
                        ])
                        break
                      }
                    }
                    if (!block)
                      throw new Error('Cannot find a place to inject')

                    const variId = b.identifier(getSafeName('r', null))
                    const vari = b.variableDeclaration('let', [
                      b.variableDeclarator(variId),
                    ])
                    const comma = b.sequenceExpression([
                      b.assignmentExpression('=', variId, node),
                      createHookCall(),
                      variId,
                    ])
                    this.replace(comma)
                    block.body.unshift(vari)
                  }
                }
              }
            },
            leave() {
              stack.pop()
            },
          })
        }
      }
    })
    return this
  }
}
