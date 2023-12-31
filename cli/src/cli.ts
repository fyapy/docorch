import {parseArgs} from '../deps.ts'

export enum Command {
  ServiceInit = 'service init',
  ServiceRemove = 'service remove',
  ServiceUpdate = 'service update',
  Ping = 'ping',
}

export function parseArguments(args: string[]) {
  const flags = parseArgs<{
    master?: string
    slave?: string
  }>(args)

  if (flags._.includes('ping')) {
    return {cmd: Command.Ping, meta: {}}
  }

  if (flags._.includes('service:init')) {
    if (flags.master) {
      const [username, password] = flags.master?.split(':') || []

      if (!username || !password) {
        throw new Error('Master flag username and password incorrect')
      }

      return {cmd: Command.ServiceInit, meta: {username, password}}
    }
    if (flags.slave) {
      return {cmd: Command.ServiceInit, meta: {slave: flags.slave}}
    }

    throw new Error('Provide master/slave flag')
  }

  if (flags._.includes('service:update')) {
    return {cmd: Command.ServiceUpdate, meta: {}}
  }

  if (flags._.includes('service:remove')) {
    return {cmd: Command.ServiceRemove, meta: {}}
  }

  throw new Error('Unknown command')
}

export async function execCommand(originalCommand: string, cwd?: 'frontend' | 'backend' | 'cli') {
  console.log(`Exec: ${originalCommand}`)
  const [cmd, ...args] = originalCommand.split(' ')

  const command = new Deno.Command(cmd, {
    cwd: cwd ? `../${cwd}` : undefined,
    args,
  })

  const {stdout} = await command.output()

  return new TextDecoder().decode(stdout)
}
