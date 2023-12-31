export async function execCommand(originalCommand: string, cwd?: 'frontend' | 'backend' | 'cli') {
  const [cmd, ...args] = originalCommand.split(' ')

  const command = new Deno.Command(cmd, {
    cwd: cwd ? `../${cwd}` : undefined,
    args,
  })

  const {code, stderr, stdout} = await command.output()

  const error = new TextDecoder().decode(stderr)
  const out = new TextDecoder().decode(stdout)
  const output = {code, error, out}

  if (code === 0) {
    return output
  }

  throw new Error(JSON.stringify(output))
}

export async function filesList(directory: string): Promise<string[]> {
  const foundFiles: string[] = []

  for await (const fileOrFolder of Deno.readDir(directory)) {
    if (fileOrFolder.isDirectory) {
      if (fileOrFolder.name === '.git') continue

      const nestedFiles = await filesList(`${directory}/${fileOrFolder.name}`)
      foundFiles.push(...nestedFiles)
    } else {
      foundFiles.push(`${directory}/${fileOrFolder.name}`)
    }
  }

  return foundFiles
}

export async function exists(filename: string) {
  try {
    await Deno.stat(filename)
    return true
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false
    } else {
      throw error
    }
  }
}

export function fixJS(js: string) {
  return JSON.stringify(js.split('`'), null, 2) + ".join('`')"
}

export const normalizeDate = (date: number) => `${date}`.length === 1 ? `0${date}` : date
