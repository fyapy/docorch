import fetch from 'isomorphic-fetch'

export interface FollowDTO {
  success: boolean
  message: string
}

export const flags = {
  master: process.env.MASTER,
  slave: process.env.SLAVE,
}

export async function parseAppFlags() {
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
    } else {
      const res = await fetch(`http://${flags.slave}:4545/api/follow-server`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token: flags.slave}),
      })

      if (!res.ok) {
        throw res
      }

      const json = await res.json()

      console.log(`Slave runned success=${json.success} message=${json.message}`)
    }
  } else {
    throw new Error(`Flags not provided ${JSON.stringify({
      env: process.env,
      flags,
    })}`)
  }
}
