import {$} from 'bun'
import parseArgs from 'minimist'
import {cwd, exitProcess} from './utils'

export enum Command {
  Recreate = 'recreate',
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

  if (flags._.includes('version') || flags.version) {
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

  if (flags._.includes('recreate')) {
    const name = flags._?.[1]

    if (!name) {
      exitProcess('Provide container name')
    }

    return {cmd: Command.Recreate, meta: {name}}
  }

  exitProcess('Unknown command')
}

export async function execCommand(command: string) {
  console.log(`Exec: ${command}`)

  try {
    return await $`${command}`.text()
  } catch (e) {
    exitProcess(`Execure command error: `, JSON.stringify(e))
  }
}
