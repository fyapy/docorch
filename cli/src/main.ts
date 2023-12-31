import {Command, execCommand, parseArguments} from './cli.ts'
import {fs, os} from '../deps.ts'

const command = parseArguments(Deno.args)

if (command.cmd === Command.Ping) {
  console.log('pong')
}

const serviceName = 'docorch.service'
const servicePath = `/etc/systemd/system/${serviceName}`

if (command.cmd === Command.ServiceRemove) {
  console.log(`Exec: systemctl stop ${serviceName}`)
  await execCommand(`systemctl stop ${serviceName}`)

  if (fs.existsSync(servicePath)) {
    Deno.removeSync(servicePath)
  }
  console.log(`Removed ${servicePath}`)

  console.log(`Exec: systemctl daemon-reload`)
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

    if (os.platform() === 'linux') {
      Deno.writeTextFileSync(servicePath, service)
      console.log(`Created ${servicePath}`)
      
      console.log(`Exec: systemctl enable ${serviceName}`)
      await execCommand(`systemctl enable ${serviceName}`)
      console.log(`Exec: systemctl start ${serviceName}`)
      await execCommand(`systemctl start ${serviceName}`)

      console.log(`${serviceName} successfully started`)
    } else {
      console.log(`Debug:\n${service}`)
    }
  }
}

if (command.cmd === Command.ServiceUpdate) {
}
