import {Command, execCommand, parseArguments} from './cli.ts'
import {download, fs, os} from '../deps.ts'
import {fileRemoveSync} from './utils.ts'

const command = parseArguments(Deno.args)

if (command.cmd === Command.Ping) {
  console.log('pong')
}

const isLinux = os.platform() === 'linux'
const serviceName = 'docorch.service'
const servicePath = `/etc/systemd/system/${serviceName}`

if (command.cmd === Command.ServiceRemove) {
  await execCommand(`systemctl stop ${serviceName}`)

  fileRemoveSync(servicePath)

  await execCommand(`systemctl daemon-reload`)

  console.log(`${serviceName} successfully removed`)
}

if (command.cmd === Command.ServiceInit) {
  if (fs.existsSync(servicePath)) {
    console.error(`Service already exists ${servicePath}`)
  } else {
    const service = [
      '[Unit]',
      'Description=Docorch deamon',
      'After=network.target',
      '',
      '[Service]',
      command.meta.slave
        ? `Environment="slave=${command.meta.slave}"`
        : `Environment="master=${command.meta.username}:${command.meta.password}"`,
      `ExecStart=/var/www/docorch`,
      'WorkingDirectory=/var/www',
      'Restart=always',
      'RestartSec=10',
      'StandardOutput=syslog',
      'StandardError=syslog',
      'SyslogIdentifier=docorch-deamon',
      '',
      '[Install]',
      'WantedBy=multi-user.target',
    ].join('\n')

    if (isLinux) {
      Deno.writeTextFileSync(servicePath, service)
      console.log(`Created ${servicePath}`)

      await execCommand(`systemctl enable ${serviceName}`)
      await execCommand(`systemctl start ${serviceName}`)

      console.log(`${serviceName} successfully started`)
    } else {
      console.log(`Debug:\n${service}`)
    }
  }
}

if (command.cmd === Command.ServiceUpdate) {
  isLinux && await execCommand(`sudo apt install unzip -y`)

  fileRemoveSync(`${Deno.cwd()}/docorch.zip`)

  console.log('Update downloading')
  const docorchZipUrl = 'https://github.com/fyapy/docorch/raw/master/backend/docorch.zip'
  await download(docorchZipUrl, {file: './docorch.zip', dir: Deno.cwd()})
  console.log('Update downloaded')

  isLinux && await execCommand(`systemctl stop ${serviceName}`)
  fileRemoveSync(`${Deno.cwd()}/docorch`)

  await execCommand(`unzip docorch.zip`)
  await execCommand(`chmod +x ./docorch`)
  await execCommand(`systemctl daemon-reload`)
  isLinux && await execCommand(`systemctl start ${serviceName}`)

  console.log(`${serviceName} successfully updated`)
}
