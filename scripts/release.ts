import Git from 'simple-git'

const git = Git()

const hash = await git.revparse(['main'])

console.log('Checkout release branch')
await git.checkout('release')

console.log(`Reset to main branch (${hash})`)
await git.reset(['--hard', hash])

console.log('Push to release branch')
await git.push(['--force'])

console.log('Checkout main branch')
await git.checkout('main')
