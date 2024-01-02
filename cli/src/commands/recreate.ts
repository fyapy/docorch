import {exitProcess} from '../utils.ts'

export async function recreateCommand({name}: {name: string}) {
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
