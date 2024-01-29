import download from 'download'
import {backendUrl, cwd, fileRemoveSync, isLinux, serviceName} from '../utils'
import {execCommand} from '../cli'

export async function updateCommand() {
  fileRemoveSync(`${cwd}/backend.zip`)

  console.log('Backend download start')
  await download(backendUrl, cwd)
  console.log('Backend download finish')

  isLinux && await execCommand(`systemctl stop ${serviceName}`)

  fileRemoveSync(`${cwd}/backend`)
  await execCommand(`chmod +x ./backend`)

  await execCommand(`systemctl daemon-reload`)
  isLinux && await execCommand(`systemctl start ${serviceName}`)

  fileRemoveSync(`${cwd}/backend.zip`)

  console.log(`${serviceName} successfully updated`)
}
