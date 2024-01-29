import fetch from 'isomorphic-fetch'
import {version} from '../utils'

export async function backendCommand() {
  const cli = version
  let backend = 'Failed to fetch'

  try {
    const res = await fetch('http://localhost:4545/stats')
    const json = await res.json()

    backend = json.version
  } catch {}

  console.log(`CLI: ${cli}\nBackend: ${backend}`)
}
