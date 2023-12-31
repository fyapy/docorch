import {execCommand, exists, filesList} from './utils.ts'

console.log('Frontend build start')
await execCommand('pnpm build', 'frontend')
console.log('Frontend builded')


const frontendFiles = await filesList('../frontend/dist')
let uiFile = await Deno.readTextFile('../backend/ui-template.ts')

for (const file of frontendFiles) {
  const content = await Deno.readTextFile(file)

  if (file.endsWith('.html')) uiFile = uiFile.replace('<--html-->', content)
  if (file.endsWith('.css')) uiFile = uiFile.replace('<--css-->', content)
  if (file.endsWith('.js')) {
    uiFile = uiFile.replace('`<--js-->`', JSON.stringify(content.split('`'), null, 2) + ".join('`')")
  }
  if (file.endsWith('.svg')) uiFile = uiFile.replace('<--svg-->', content)
}

await Deno.writeTextFile('../backend/ui.ts', uiFile)


console.log('Backend build start')
if (await exists('../backend/docorch')) {
  await Deno.remove('../backend/docorch')
}

await execCommand('deno task build:linux', 'backend')
console.log('Backend builded')


console.log('Backend zipping start')
await execCommand('zip docorch.zip docorch', 'backend')
console.log('Backend zipped')

