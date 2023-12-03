import {parse} from './deps.ts'

interface Flags {
  master?: boolean
  slave?: string
}

export const flags = parse<Flags>(Deno.args)

if (flags.master) {
  console.log('Docorch started as master')
} else if (flags.slave) {
  console.log(`Docorch started as slave, master ip ${flags.slave}`)
} else {
  throw new Error('Docorch flags not provided')
}
