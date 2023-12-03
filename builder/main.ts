import {exists, getFilesList, runCommand} from './utils.ts'

console.log('Frontend build start')
await runCommand('pnpm', {
  args: ['build'],
  cwd: 'frontend',
})
console.log('Frontend builded')


const frontendFiles = await getFilesList('../frontend/dist')
let uiFile = await Deno.readTextFile('../backend/ui-template.ts')

for (const file of frontendFiles) {
  const content = await Deno.readTextFile(file)

  if (file.endsWith('.html')) uiFile = uiFile.replace('<--html-->', content)
  if (file.endsWith('.css')) uiFile = uiFile.replace('<--css-->', content)
  // if (file.endsWith('.js')) uiFile = uiFile.replace('<--js-->', content)
  if (file.endsWith('.svg')) uiFile = uiFile.replace('<--svg-->', content)
}

await Deno.writeTextFile('../backend/ui.ts', uiFile)


console.log('Backend build start')
if (await exists('../backend/docorch')) {
  await Deno.remove('../backend/docorch')
}
await runCommand('deno', {
  args: ['task', 'build'],
  showError: false,
  cwd: 'backend',
})
console.log('Backend builded')

