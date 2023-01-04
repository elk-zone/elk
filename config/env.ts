import Git from 'simple-git'
import { isDevelopment } from 'std-env'

export { version } from '../package.json'
export const isPR = process.env.PULL_REQUEST === 'true'
export const isPreview = isPR || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev'

const git = Git()
export const getGitInfo = async () => {
  const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
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
        ? 'main'
        : 'release'
  return { commit, branch, env } as const
}
