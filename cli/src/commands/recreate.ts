import fetch from 'isomorphic-fetch'
import {exitProcess} from '../utils'

export async function recreateCommand({name}: {name: string}) {
  console.log(`Starting recreate container with name = "${name}"`)

  try {
    const res = await fetch('http://localhost:4545/stats')
    const json = await res.json()

    if (json.mode !== 'master') {
      exitProcess('Recreate able to execut only on master node')
    }
  } catch {
    exitProcess('Fetch Backend failed')
  }

  const res = await fetch('http://localhost:4545/api/recreate-container', {
    body: JSON.stringify({name}),
    method: 'POST',
  })

  const json = await res.json() as {success: boolean}

  if (!json.success) {
    exitProcess(JSON.stringify(json))
  }

  console.log(`Container with name = "${name}" successfully restarted`)
}
