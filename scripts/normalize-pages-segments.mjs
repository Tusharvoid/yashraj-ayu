import { readdir, rename, rmdir } from 'node:fs/promises'
import path from 'node:path'

// Next 16.2 on Windows can emit nested __next segment files using backslashes,
// while the browser requests the documented dot-separated export filenames.
// Normalize only generated segment directories; Linux's already-flat output
// and all public asset directories are left unchanged.
export async function normalizePagesSegments(output) {
  let count = 0
  async function flatten(directory, routeDirectory, prefix) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name)
      const name = `${prefix}.${entry.name}`
      if (entry.isDirectory()) await flatten(source, routeDirectory, name)
      else {
        if (!name.endsWith('.txt')) throw new Error(`Unexpected segment asset: ${source}`)
        const siblings = await readdir(routeDirectory)
        if (siblings.includes(name)) throw new Error(`Duplicate segment asset: ${name}`)
        await rename(source, path.join(routeDirectory, name))
        count++
      }
    }
    await rmdir(directory)
  }
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const child = path.join(directory, entry.name)
      if (entry.name.startsWith('__next.')) await flatten(child, directory, entry.name)
      else if (entry.name !== '_next') await visit(child)
    }
  }
  await visit(output)
  return count
}
