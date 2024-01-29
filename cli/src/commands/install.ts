import fs from 'fs'
import download from 'download'
import {backendUrl, cwd, fileRemoveSync, isLinux, serviceName, servicePath} from '../utils'
import {execCommand} from '../cli'

export async function installCommand(meta: {slave?: string; master?: string}) {
  if (fs.existsSync(servicePath) || fs.existsSync(`${cwd}/backend`)) {
    console.error(`Already installed`)
    return
  }

  const service = [
    '[Unit]',
    'Description=Docorch backend',
    'After=network.target',
    '',
    '[Service]',
    meta.slave
      ? `Environment="SLAVE=${meta.slave}"`
      : `Environment="MASTER=${meta.master}"`,
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
    console.log('Backend download start')
    await download(backendUrl, cwd)
    console.log('Backend download finish')

    await execCommand(`chmod +x ./backend`)

    fs.writeFileSync(servicePath, service)
    console.log(`Created ${servicePath}`)

    await execCommand(`systemctl enable ${serviceName}`)
    await execCommand(`systemctl start ${serviceName}`)

    console.log(`${serviceName} successfully installed`)
  } else {
    console.log(`Debug:\n${service}`)
  }
}
