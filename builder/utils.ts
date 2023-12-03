type RunCommand = {
  args: string[]
  cwd: string
  showError?: boolean
}
export async function runCommand(cmd: string, {args, cwd, showError = true}: RunCommand) {
  const command = new Deno.Command(cmd, {args, cwd: `../${cwd}`})
  const {stdout, stderr} = await command.output()

  if (showError && stderr.length) {
    throw new TextDecoder().decode(stderr)
  }

  return new TextDecoder().decode(stdout)
}

const IGNORED_DIRECTORIES = new Set([".git"]);

export async function getFilesList(
  directory: string,
): Promise<string[]> {
  const foundFiles: string[] = [];
  for await (const fileOrFolder of Deno.readDir(directory)) {
    if (fileOrFolder.isDirectory) {
      if (IGNORED_DIRECTORIES.has(fileOrFolder.name)) {
        // Skip this folder, it's in the ignore list.
        continue;
      }
      // If it's not ignored, recurse and search this folder for files.
      const nestedFiles = await getFilesList(
        `${directory}/${fileOrFolder.name}`,
      );
      foundFiles.push(...nestedFiles);
    } else {
      // We found a file, so store it.
      foundFiles.push(`${directory}/${fileOrFolder.name}`);
    }
  }
  return foundFiles;
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
