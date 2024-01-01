import {Command, parseArguments} from './cli.ts'
import {backendCommand} from './commands/version.ts'
import {installCommand} from './commands/install.ts'
import {updateCommand} from './commands/update.ts'
import {removeCommand} from './commands/remove.ts'

const command = parseArguments(Deno.args)

if (command.cmd === Command.Ping) {
  console.log('pong')
}

if (command.cmd === Command.Version) {
  await backendCommand()
}

if (command.cmd === Command.Remove) {
  await removeCommand()
}

if (command.cmd === Command.Install) {
  await installCommand(command.meta)
}

if (command.cmd === Command.Update) {
  await updateCommand()
}
