import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { normalizePagesSegments } from '../scripts/normalize-pages-segments.mjs'

test('normalizes Windows segments, preserves flat Linux assets, and is idempotent', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'yashraj-segments-test-'))
  try {
    const route = path.join(temporary, 'services', 'consultation')
    const segment = path.join(route, '__next.!group', 'services', '$d$slug')
    await mkdir(segment, { recursive: true })
    await writeFile(path.join(segment, '__PAGE__.txt'), 'page payload')
    await writeFile(path.join(route, '__next._tree.txt'), 'tree payload')
    await writeFile(path.join(route, 'index.html'), '<h1>Consultation</h1>')
    assert.equal(await normalizePagesSegments(temporary), 1)
    assert.equal(await readFile(path.join(route, '__next.!group.services.$d$slug.__PAGE__.txt'), 'utf8'), 'page payload')
    assert.equal(await readFile(path.join(route, '__next._tree.txt'), 'utf8'), 'tree payload')
    assert.equal((await readdir(route)).length, 3)
    assert.equal(await normalizePagesSegments(temporary), 0)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})
