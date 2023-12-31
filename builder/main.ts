import {execCommand, exists, filesList, fixJS} from './utils.ts'

console.log('Frontend build start')
await execCommand('pnpm build', 'frontend')
console.log('Frontend build finish')

console.log('Backend build prepare')
const frontendFiles = await filesList('../frontend/dist')
let uiFile = await Deno.readTextFile('../backend/ui-template.ts')

for (const file of frontendFiles) {
  const content = await Deno.readTextFile(file)

  if (file.endsWith('.js')) uiFile = uiFile.replace('`<--js-->`', fixJS(content))
  if (file.endsWith('.html')) uiFile = uiFile.replace('<--html-->', content)
  if (file.endsWith('.css')) uiFile = uiFile.replace('<--css-->', content)
  if (file.endsWith('.svg')) uiFile = uiFile.replace('<--svg-->', content)
}

await Deno.writeTextFile('../backend/ui.ts', uiFile)


let mainFile = await Deno.readTextFile('../backend/src/main.ts')

const date = new Date()
const versionMask = /version = \'\d\d\.\d\d\.\d\d\'/gm
const version = `${date.getDate()}.${date.getHours()}.${date.getMinutes()}`

mainFile = mainFile.replace(versionMask, `version = \'${version}\'`)

await Deno.writeTextFile('../backend/src/main.ts', mainFile)


console.log('Backend build start')
if (await exists('../backend/docorch')) {
  await Deno.remove('../backend/docorch')
}

await execCommand('deno task build:linux', 'backend')
console.log('Backend build finish')


console.log('Backend zip start')
await execCommand('zip docorch.zip docorch', 'backend')
console.log('Backend zip finish')

