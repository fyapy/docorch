import {Command, execCommand, parseArguments} from './cli.ts'
import {cwd, fileRemoveSync} from './utils.ts'
import {backendCommand} from './commands/version.ts'
import {download, fs, os} from '../deps.ts'

const command = parseArguments(Deno.args)

if (command.cmd === Command.Ping) {
  console.log('pong')
}

if (command.cmd === Command.Version) {
  await backendCommand()
}

const isLinux = os.platform() === 'linux'
const serviceName = 'docorch.service'
const servicePath = `/etc/systemd/system/${serviceName}`

if (command.cmd === Command.Remove) {
  await execCommand(`systemctl stop ${serviceName}`)

  fileRemoveSync(servicePath)

  await execCommand(`systemctl daemon-reload`)

  console.log(`${serviceName} successfully removed`)
}

if (command.cmd === Command.Init) {
  if (fs.existsSync(servicePath)) {
    console.error(`Service already exists ${servicePath}`)
  } else {
    const service = [
      '[Unit]',
      'Description=Docorch backend',
      'After=network.target',
      '',
      '[Service]',
      command.meta.slave
        ? `Environment="slave=${command.meta.slave}"`
        : `Environment="master=${command.meta.master}"`,
      `ExecStart=/etc/docorch/backend`,
      'WorkingDirectory=/etc/docorch',
      'Restart=always',
      'RestartSec=10',
      'StandardOutput=syslog',
      'StandardError=syslog',
      'SyslogIdentifier=docorch-backend',
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

if (command.cmd === Command.Update) {
  isLinux && await execCommand(`apt install unzip -y`)

  fileRemoveSync(`${cwd}/backend.zip`)

  console.log('Update downloading')
  const docorchZipUrl = 'https://github.com/fyapy/docorch/raw/master/backend/backend.zip'
  await download(docorchZipUrl, {file: './backend.zip', dir: cwd})
  console.log('Update downloaded')

  isLinux && await execCommand(`systemctl stop ${serviceName}`)
  fileRemoveSync(`${cwd}/backend`)

  await execCommand(`unzip backend.zip`)
  await execCommand(`chmod +x ./backend`)
  await execCommand(`systemctl daemon-reload`)
  isLinux && await execCommand(`systemctl start ${serviceName}`)

  console.log(`${serviceName} successfully updated`)
}
