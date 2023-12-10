import {parse} from './deps.ts'

interface Flags {
  master?: string
  slave?: string
}

export const flags = parse<Flags>(Deno.args)

if (flags.master) {
  const [username, password] = flags.master.split(':')

  if (!username || !password) {
    throw new Error('Docorch master flag params incorrect')
  }

  console.log('Docorch started as master')
} else if (flags.slave) {
  console.log(`Docorch started as slave, master ip ${flags.slave}`)
} else {
  throw new Error('Docorch flags not provided')
}
