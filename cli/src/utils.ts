import process from 'process'
import fs from 'fs'

export function fileRemoveSync(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
  console.log(`Removed ${path}`)
}

export const cwd = '/etc/docorch'

export const version = '06.09.36'

export const isLinux = process.platform === 'linux'

export const serviceName = 'docorch.service'
export const servicePath = `/etc/systemd/system/${serviceName}`

export const backendZipUrl = 'https://github.com/fyapy/docorch/raw/master/backend/backend.zip'

export function exitProcess(...args: any[]): never {
  console.error(...args)
  process.exit(1)
}
