import {exec as execCb} from 'child_process'
import fs from 'fs/promises'
import path from 'path'

export async function filesList(directory: string): Promise<string[]> {
  const foundFiles: string[] = []

  for (const filePath of await fs.readdir(directory)) {
    const fileOrFolder = await fs.stat(`${directory}/${filePath}`)
    const name = path.basename(filePath)

    if (fileOrFolder.isDirectory()) {
      if (name === '.git') continue

      const nestedFiles = await filesList(`${directory}/${name}`)
      foundFiles.push(...nestedFiles)
    } else {
      foundFiles.push(`${directory}/${name}`)
    }
  }

  return foundFiles
}

export async function exists(filename: string) {
  try {
    await fs.stat(filename)
    return true
  } catch (error) {
    return false
  }
}

export async function fileRemove(path: string) {
  if (await exists(path)) {
    await fs.unlink(path)
  }
}

export function escapeJS(js: string) {
  return JSON.stringify(js.split('`'), null, 2) + ".join('`')"
}

export const normalizeDate = (date: number) => `${date}`.length === 1 ? `0${date}` : date

export async function updateVersion(filePath: string, version: string) {
  const file = String(await fs.readFile(filePath))

  const versionMask = /version = \'\d\d\.\d\d\.\d\d\'/gm

  await fs.writeFile(filePath, file.replace(versionMask, `version = \'${version}\'`))
}

export function newVersion() {
  const date = new Date()
  return [
    normalizeDate(date.getDate()),
    normalizeDate(date.getHours()),
    normalizeDate(date.getMinutes()),
  ].join('.')
}

export const exec = (cmd: string, cwd: string) => new Promise<string>((res, rej) => {
  execCb(cmd, cwd ? {cwd: `../${cwd}`} : {}, (error, stdout, stderr) => {
    if (error || stderr) {
      rej(error || stderr)
      return
    }

    res(stdout.trim())
  })
})
