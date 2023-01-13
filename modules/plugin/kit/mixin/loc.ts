import { types } from 'recast'
import N = types.namedTypes

interface MixinLocBase {
  /**
   * The minimum number of locations to be matched.
   *
   * If the count can't be meet, a exception will be thown.
   */
  require?: number
  /**
   * The index(s) of the location to be matched.
   *
   * If the index is not specified, all locations will be matched.
   */
  index?: number | number[]
  /**
   * Shift to x statements before / after.
   *
   * This should be avoided if direct match is possible,
   * ideally being kept below 3.
   */
  shift?: number
}

interface MixinLocImportedCallExpression {
  /**
   * Represent the location of a CallExpression to a imported functions.
   */
  type: 'ImportedCallExpression'
  /**
   * The file path of the import statement.
   *
   * If the file path is not specified, it could only match auto-imported functions.
   *
   * @example '/composables/users.ts'
   */
  file?: string
  /**
   * The name of the imported function.
   *
   * This should align with the exported function name, not the local one.
   *
   * @example 'useUsers' // for `import { useUsers as use } from 'users.ts'`
   */
  method: string
  /**
   * Filter the matched AST node.
   */
  filter?: (node: N.CallExpression) => boolean
}

interface MixinLocCallExpression {
  /**
   * Represent the location of a CallExpression to a given function name.
   */
  type: 'CallExpression'
  /**
   * The name of the function.
  *
  * @example 'useUsers'
  */
  method: string
  /**
   * Filter the matched AST node.
   */
  filter?: (node: N.CallExpression) => boolean
}

interface MixinLocInjectBefore {
  /**
   * Inject before the matched statement
   */
  before: boolean
  after?: false
}

interface MixinLocInjectAfter {
  /**
   * Inject after the matched statement
   */
  after: boolean
  before?: false
}

export type MixinInjectLoc = MixinLocBase
& (MixinLocInjectBefore | MixinLocInjectAfter)
& (MixinLocImportedCallExpression | MixinLocCallExpression)
