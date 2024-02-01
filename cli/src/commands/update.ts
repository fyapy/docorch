import download from 'download'
import {backendUrl, cwd, fileRemoveSync, isLinux, serviceName} from '../utils'
import {execCommand} from '../cli'

export async function updateCommand() {
  isLinux && await execCommand(`systemctl stop ${serviceName}`)
  fileRemoveSync(`${cwd}/backend`)

  console.log('Backend download start')
  await download(backendUrl, cwd)
  console.log('Backend download finish')

  await execCommand(`chmod +x ${cwd}/backend`)

  await execCommand(`systemctl daemon-reload`)
  isLinux && await execCommand(`systemctl start ${serviceName}`)

  console.log(`${serviceName} successfully updated`)
}
