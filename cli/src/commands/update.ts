import {backendZipUrl, cwd, fileRemoveSync, isLinux, serviceName} from '../utils.ts'
import {download} from '../../deps.ts'
import {execCommand} from '../cli.ts'

export async function updateCommand() {
  isLinux && await execCommand(`apt install unzip -y`)

  fileRemoveSync(`${cwd}/backend.zip`)

  console.log('Backend download start')
  await download(backendZipUrl, {file: './backend.zip', dir: cwd})
  console.log('Backend download finish')

  isLinux && await execCommand(`systemctl stop ${serviceName}`)

  fileRemoveSync(`${cwd}/backend`)
  await execCommand(`unzip backend.zip`)
  await execCommand(`chmod +x ./backend`)

  await execCommand(`systemctl daemon-reload`)
  isLinux && await execCommand(`systemctl start ${serviceName}`)

  fileRemoveSync(`${cwd}/backend.zip`)

  console.log(`${serviceName} successfully updated`)
}
