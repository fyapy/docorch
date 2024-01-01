import {backendZipUrl, cwd, fileRemoveSync, isLinux, serviceName, servicePath} from '../utils.ts'
import {download, fs} from '../../deps.ts'
import {execCommand} from '../cli.ts'

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
    await download(backendZipUrl, {file: './backend.zip', dir: cwd})
    console.log('Backend download finish')

    await execCommand(`unzip backend.zip`)
    await execCommand(`chmod +x ./backend`)
    fileRemoveSync(`${cwd}/backend.zip`)

    await execCommand('curl -sSL https://get.docker.com | sh')
    await execCommand('sudo usermod -aG docker $(whoami)')

    Deno.writeTextFileSync(servicePath, service)
    console.log(`Created ${servicePath}`)

    await execCommand(`systemctl enable ${serviceName}`)
    await execCommand(`systemctl start ${serviceName}`)

    console.log(`${serviceName} successfully installed`)
  } else {
    console.log(`Debug:\n${service}`)
  }
}
