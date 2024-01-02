import {parseArgs} from '../deps.ts'
import {cwd, exitProcess} from './utils.ts'

export enum Command {
  Uninstall = 'uninstall',
  Install = 'install',
  Version = 'version',
  Update = 'update',
  Ping = 'ping',
}

export function parseArguments(args: string[]) {
  const flags = parseArgs<{
    version?: string | boolean
    master?: string
    slave?: string
  }>(args)

  if (flags._.includes('ping')) {
    return {cmd: Command.Ping, meta: {}}
  }

  if (flags._.includes('version')) {
    return {cmd: Command.Version, meta: {}}
  }

  if (flags._.includes('install')) {
    if (flags.master) {
      const [username, password] = flags.master?.split(':') || []

      if (!username || !password) {
        exitProcess('Master flag username and password incorrect')
      }

      return {cmd: Command.Install, meta: {master: flags.master}}
    }
    if (flags.slave) {
      return {cmd: Command.Install, meta: {slave: flags.slave}}
    }

    exitProcess('Provide master/slave flag')
  }

  if (flags._.includes('update')) {
    return {cmd: Command.Update, meta: {}}
  }

  if (flags._.includes('uninstall')) {
    return {cmd: Command.Uninstall, meta: {}}
  }

  exitProcess('Unknown command')
}

export async function execCommand(originalCommand: string) {
  console.log(`Exec: ${originalCommand}`)
  const [cmd, ...args] = originalCommand.split(' ')

  const command = new Deno.Command(cmd, {args, cwd})

  const {code, stderr, stdout} = await command.output()

  const error = new TextDecoder().decode(stderr)
  const out = new TextDecoder().decode(stdout)
  const output = {code, error, out}

  if (code === 0) {
    return output
  }

  exitProcess(`Execure command error: `, JSON.stringify(output))
}
