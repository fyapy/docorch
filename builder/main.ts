import {execCommand, fileRemove, filesList, escapeJS, newVersion, updateVersion} from './utils.ts'

const version = newVersion()

console.log('Frontend build start')
await execCommand('pnpm build', 'frontend')
console.log('Frontend build finish')

console.log('Backend build prepare')
const frontendFiles = await filesList('../frontend/dist')
let uiFile = await Deno.readTextFile('../backend/ui-template.ts')

for (const file of frontendFiles) {
  const content = await Deno.readTextFile(file)

  if (file.endsWith('.js')) uiFile = uiFile.replace('`<--js-->`', escapeJS(content))
  if (file.endsWith('.html')) uiFile = uiFile.replace('<--html-->', content)
  if (file.endsWith('.css')) uiFile = uiFile.replace('<--css-->', content)
  if (file.endsWith('.svg')) uiFile = uiFile.replace('<--svg-->', content)
}

await Deno.writeTextFile('../backend/ui.ts', uiFile)

await updateVersion('../backend/src/utils.ts', version)
await updateVersion('../cli/src/utils.ts', version)

console.log('Backend build start')
await fileRemove('../backend/backend')

await execCommand('deno task build:linux', 'backend')
console.log(`Backend build finish, version ${version}`)


console.log('Backend zip start')
await execCommand('zip backend.zip backend', 'backend')
console.log('Backend zip finish')

console.log('CLI build start')
await fileRemove('../cli/docorch')

await execCommand('deno task build:linux', 'cli')
console.log(`CLI build finish, version ${version}`)

console.log('CLI zip start')
await execCommand('zip docorch.zip docorch', 'cli')
console.log('CLI zip finish')
