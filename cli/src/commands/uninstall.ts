import {cwd, fileRemoveSync, serviceName, servicePath} from '../utils'
import {execCommand} from '../cli'

export async function uninstallCommand() {
  await execCommand(`systemctl stop ${serviceName}`)

  fileRemoveSync(servicePath)
  fileRemoveSync(`${cwd}/backend`)

  await execCommand(`systemctl daemon-reload`)

  console.log(`${serviceName} successfully removed`)
}
