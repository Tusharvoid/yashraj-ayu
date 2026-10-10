import { cp, lstat, mkdtemp, readdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { normalizePagesSegments } from './normalize-pages-segments.mjs'

// Build only the public routes in an isolated tree. Never move/delete the live
// app routes or copy environment files into a deployable directory.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stage = await mkdtemp(path.join(root, '.pages-build-'))
const excludedRoutes = new Set(['(doctor)', 'api', 'patient', 'room', 'sign-in', 'sign-up'])

try {
  for (const file of ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs']) {
    await cp(path.join(root, file), path.join(stage, file))
  }
  await cp(path.join(root, 'src'), path.join(stage, 'src'), {
    recursive: true,
    filter(source) {
      const relative = path.relative(path.join(root, 'src'), source).split(path.sep)
      if (['middleware.ts', 'proxy.ts'].includes(relative[0])) return false
      return !(relative[0] === 'app' && excludedRoutes.has(relative[1]))
    },
  })
  await cp(path.join(root, 'public'), path.join(stage, 'public'), { recursive: true })
  await cp(path.join(root, 'scripts/static-providers.tsx'), path.join(stage, 'src/components/auth/SiteProviders.tsx'))
  const result = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build', stage], {
    cwd: stage,
    stdio: 'inherit',
    env: { ...process.env, YASHRAJ_STATIC_BUILD: '1', YASHRAJ_BUILD_ROOT: root },
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Static build failed (${result.status})`)

  const output = path.join(stage, 'out')
  const normalized = await normalizePagesSegments(output)
  console.log(`Normalized ${normalized} Windows segment assets`)
  for (const required of ['index.html', 'clinic/index.html', 'book/index.html', 'ayurveda/index.html']) {
    await lstat(path.join(output, required))
  }
  async function validateAssets(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) await validateAssets(file)
      else if ((await lstat(file)).size > 25 * 1024 * 1024) throw new Error(`Asset exceeds Pages 25 MiB limit: ${file}`)
    }
  }
  await validateAssets(output)
  for (const excluded of ['api', 'doctor', 'patient', 'room', 'sign-in', 'sign-up']) {
    if ((await readdir(output)).includes(excluded)) throw new Error(`Private route in export: ${excluded}`)
  }

  // Swap only the generated dist directory after a successful build. Preserve
  // the previous artifact in the isolated stage until the new copy succeeds.
  const destination = path.join(root, 'dist')
  const backup = path.join(stage, 'previous-dist')
  let hadPrevious = false
  try {
    const info = await lstat(destination)
    if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('dist must be a regular generated directory')
    await rename(destination, backup)
    hadPrevious = true
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  try {
    // Copy avoids Windows refusing to rename Next's recently generated out/
    // while a compiler/virus scanner still holds a directory handle.
    await cp(output, destination, { recursive: true, force: false, errorOnExist: true })
  } catch (error) {
    await rm(destination, { recursive: true, force: true })
    if (hadPrevious) await rename(backup, destination)
    throw error
  }
  console.log('Cloudflare Pages artifact ready: dist/ (gateway + clinic + Ayurveda)')
} finally {
  // stage is the exact mkdtemp result under this checkout, never a user path.
  if (path.dirname(stage) !== root || !path.basename(stage).startsWith('.pages-build-')) {
    throw new Error('Refusing to clean an unexpected build path')
  }
  await rm(stage, { recursive: true, force: true })
}
