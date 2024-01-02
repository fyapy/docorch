import {fs, os} from '../deps.ts'

export function fileRemoveSync(path: string) {
  if (fs.existsSync(path)) {
    Deno.removeSync(path)
  }
  console.log(`Removed ${path}`)
}

export const cwd = '/etc/docorch'

export const version = '02.04.38'

export const isLinux = os.platform() === 'linux'

export const serviceName = 'docorch.service'
export const servicePath = `/etc/systemd/system/${serviceName}`

export const backendZipUrl = 'https://github.com/fyapy/docorch/raw/master/backend/backend.zip'
