import {exec as execCb} from 'child_process'
import fs from 'fs'

export function fileRemoveSync(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
  console.log(`Removed ${path}`)
}

export const cwd = '/etc/docorch'

export const version = '01.08.34'

export const isLinux = process.platform === 'linux'

export const serviceName = 'docorch.service'
export const servicePath = `/etc/systemd/system/${serviceName}`

export const backendUrl = 'https://github.com/fyapy/docorch/raw/master/backend/backend'

export function exitProcess(...args: any[]): never {
  console.error(...args)
  process.exit(1)
}

export const exec = (cmd: string) => new Promise<string>((res, rej) => {
  execCb(cmd, (error, stdout, stderr) => {
    if (error || stderr) {
      rej(error || stderr)
      return
    }

    res(stdout.trim())
  })
})
