import {parseArgs} from '../deps.ts'
import {cwd} from './utils.ts'

export enum Command {
  Version = 'version',
  Remove = 'remove',
  Update = 'update',
  Init = 'init',
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

  if (flags._.includes('init')) {
    if (flags.master) {
      const [username, password] = flags.master?.split(':') || []

      if (!username || !password) {
        throw new Error('Master flag username and password incorrect')
      }

      return {cmd: Command.Init, meta: {master: flags.master}}
    }
    if (flags.slave) {
      return {cmd: Command.Init, meta: {slave: flags.slave}}
    }

    throw new Error('Provide master/slave flag')
  }

  if (flags._.includes('update')) {
    return {cmd: Command.Update, meta: {}}
  }

  if (flags._.includes('remove')) {
    return {cmd: Command.Remove, meta: {}}
  }

  throw new Error('Unknown command')
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

  throw new Error(JSON.stringify(output))
}
