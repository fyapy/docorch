import {uninstallCommand} from './commands/uninstall'
import {recreateCommand} from './commands/recreate'
import {backendCommand} from './commands/version'
import {installCommand} from './commands/install'
import {updateCommand} from './commands/update'
import {Command, parseArguments} from './cli'

const command = parseArguments(process.argv)

switch (command.cmd) {
  case Command.Ping:
    console.log('pong')
    break

  case Command.Version:
    await backendCommand()
    break

  case Command.Uninstall:
    await uninstallCommand()
    break

  case Command.Install:
    await installCommand(command.meta)
    break

  case Command.Update:
    await updateCommand()
    break

  case Command.Recreate:
    await recreateCommand(command.meta as {name: string})
    break
}
