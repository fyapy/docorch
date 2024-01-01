import {fs} from '../deps.ts'

export function fileRemoveSync(path: string) {
  if (fs.existsSync(path)) {
    Deno.removeSync(path)
  }
  console.log(`Removed ${path}`)
}

export const cwd = '/etc/docorch'

export const version = '01.23.48'
