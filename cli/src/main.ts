import {uninstallCommand} from './commands/uninstall'
import {recreateCommand} from './commands/recreate'
import {backendCommand} from './commands/version'
import {installCommand} from './commands/install'
import {updateCommand} from './commands/update'
import {Command, parseArguments} from './cli'

const command = parseArguments(Bun.argv)

if (command.cmd === Command.Ping) {
  console.log('pong')
}

if (command.cmd === Command.Version) {
  await backendCommand()
}

if (command.cmd === Command.Uninstall) {
  await uninstallCommand()
}

if (command.cmd === Command.Install) {
  await installCommand(command.meta)
}

if (command.cmd === Command.Update) {
  await updateCommand()
}

if (command.cmd === Command.Recreate) {
  await recreateCommand(command.meta as {name: string})
}
