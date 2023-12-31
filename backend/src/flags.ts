import {parse} from '../deps.ts'

export interface FollowDTO {
  success: boolean
  message: string
}

interface Flags {
  master?: string
  slave?: string
  debug?: boolean
}

export const flags = parse<Flags>(Deno.args)

const envMaster = Deno.env.get('master')
if (envMaster) {
  flags.master = envMaster
}

const envSlave = Deno.env.get('slave')
if (envSlave) {
  flags.slave = envSlave
}

export const debug = flags.debug ? console.log : () => {}


if (flags.master) {
  const [username, password] = flags.master.split(':')

  if (!username || !password) {
    throw new Error('Master flag params incorrect')
  }

  console.log('Started as master')
} else if (flags.slave) {
  const devIp = '5.4.145.90'
  console.log(`Started as slave, master ip ${flags.slave}`)

  if (flags.slave === devIp) {
    console.log('Slave runned success=true message=Runned not in production mode')
  } else  {
    try {
      const res = await fetch(`http://${flags.slave}:4545/api/follow-server`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token: flags.slave}),
      })

      if (!res.ok) {
        throw res
      }

      const json = await res.json() as FollowDTO

      console.log(`Slave runned success=${json.success} message=${json.message}`)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
} else {
  throw new Error(`Flags not provided ${JSON.stringify({
    env: Deno.env.toObject(),
    flags,
  })}`)
}
