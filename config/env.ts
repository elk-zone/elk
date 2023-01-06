import Git from 'simple-git'
import { isDevelopment } from 'std-env'

export { version } from '../package.json'

/**
 * Environment variable `PULL_REQUEST` provided by Netlify.
 * @see {@link https://docs.netlify.com/configure-builds/environment-variables/#git-metadata}
 *
 * Whether triggered by a GitHub PR
 */
export const isPR = process.env.PULL_REQUEST === 'true'

/**
 * Environment variable `BRANCH` provided by Netlify.
 * @see {@link https://docs.netlify.com/configure-builds/environment-variables/#git-metadata}
 *
 * Git branch
 */
export const gitBranch = process.env.BRANCH

/**
 * Environment variable `CONTEXT` provided by Netlify.
 * @see {@link https://docs.netlify.com/configure-builds/environment-variables/#build-metadata}
 *
 * Whether triggered by PR, `deploy-preview` or `dev`.
 */
export const isPreview = isPR || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev'

const git = Git()
export const getGitInfo = async () => {
  const branch = gitBranch || await git.revparse(['--abbrev-ref', 'HEAD'])
  const commit = await git.revparse(['HEAD'])
  return { branch, commit }
}

export const getEnv = async () => {
  const { commit, branch } = await getGitInfo()
  const env = isDevelopment
    ? 'dev'
    : isPreview
      ? 'preview'
      : branch === 'main'
        ? 'canary'
        : 'release'
  return { commit, branch, env } as const
}
