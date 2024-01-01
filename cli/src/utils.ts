import {fs} from '../deps.ts'

export function fileRemoveSync(path: string) {
  if (fs.existsSync(path)) {
    Deno.removeSync(path)
  }
  console.log(`Removed ${path}`)
}

export const cwd = '/var/www'

export const version = '01.22.18'
