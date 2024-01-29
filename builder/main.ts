import {exec, fileRemove, filesList, escapeJS, newVersion, updateVersion} from './utils.ts'
import fs from 'fs/promises'

const version = newVersion()

console.log('Frontend build start')
await exec('pnpm build', 'frontend')
console.log('Frontend build finish')

console.log('Backend build prepare')
const frontendFiles = await filesList('../frontend/dist')
let uiFile = String(await fs.readFile('../backend/ui-template.ts'))

for (const file of frontendFiles) {
  const content = String(await fs.readFile(file))

  if (file.endsWith('.js')) uiFile = uiFile.replace('`<--js-->`', escapeJS(content))
  if (file.endsWith('.html')) uiFile = uiFile.replace('<--html-->', content)
  if (file.endsWith('.css')) uiFile = uiFile.replace('<--css-->', content)
  if (file.endsWith('.svg')) uiFile = uiFile.replace('<--svg-->', content)
}

await fs.writeFile('../backend/ui.ts', uiFile)

await updateVersion('../backend/src/utils.ts', version)
await updateVersion('../cli/src/utils.ts', version)

console.log('Backend build start')
await fileRemove('../backend/backend')

await exec('npm run build:linux', 'backend')
console.log(`Backend build finish, version ${version}`)


console.log('CLI build start')
await fileRemove('../cli/docli')

await exec('npm run build:linux', 'cli')
console.log(`CLI build finish, version ${version}`)
