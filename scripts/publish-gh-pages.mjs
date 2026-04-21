import { mkdtemp, readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const argv = process.argv.slice(2);
const requestedVersion = argv[0] || null;

const versionPath = resolve(root, 'version.json');
const distDir = resolve(root, 'dist');

const run = (cmd, args, cwd = root) => {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `Command failed: ${cmd} ${args.join(' ')}`).trim());
  }
  return (result.stdout || '').trim();
};

const existsBranch = (ref) => {
  const result = spawnSync('git', ['show-ref', '--verify', '--quiet', ref], {
    cwd: root,
    encoding: 'utf8'
  });
  return result.status === 0;
};

const semverCompare = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
};

const clearWorktreeFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.name !== '.git')
      .map((entry) => rm(join(dir, entry.name), { recursive: true, force: true }))
  );
};

const versionMeta = JSON.parse(await readFile(versionPath, 'utf8'));
const version = requestedVersion || versionMeta.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid version: ${version}`);
}

const sourceFileName = `starfall-v${version}.html`;
const sourceFile = resolve(distDir, sourceFileName);
const sourceHtml = await readFile(sourceFile, 'utf8');

const tempDir = await mkdtemp(join(tmpdir(), 'project-starfall-pages-'));

let hadPagesBranch = false;
if (existsBranch('refs/heads/gh-pages')) {
  hadPagesBranch = true;
  run('git', ['worktree', 'add', '-B', 'gh-pages', tempDir, 'gh-pages']);
} else if (existsBranch('refs/remotes/origin/gh-pages')) {
  hadPagesBranch = true;
  run('git', ['worktree', 'add', '-b', 'gh-pages', tempDir, 'origin/gh-pages']);
} else {
  run('git', ['worktree', 'add', '--detach', tempDir, 'HEAD']);
  run('git', ['checkout', '--orphan', 'gh-pages'], tempDir);
  await clearWorktreeFiles(tempDir);
}

let publishedVersions = [];
try {
  const existing = JSON.parse(await readFile(join(tempDir, 'versions.json'), 'utf8'));
  if (Array.isArray(existing.publishedVersions)) {
    publishedVersions = existing.publishedVersions;
  }
} catch {
  publishedVersions = [];
}

if (!publishedVersions.includes(version)) {
  publishedVersions.push(version);
}
publishedVersions.sort(semverCompare);

await mkdir(join(tempDir, 'versions'), { recursive: true });
await writeFile(join(tempDir, '.nojekyll'), '', 'utf8');
await writeFile(join(tempDir, 'index.html'), sourceHtml, 'utf8');
await writeFile(join(tempDir, '404.html'), sourceHtml, 'utf8');
await writeFile(join(tempDir, 'versions', sourceFileName), sourceHtml, 'utf8');
await writeFile(
  join(tempDir, 'versions.json'),
  `${JSON.stringify(
    {
      stableVersion: version,
      publishedVersions,
      updatedAt: new Date().toISOString()
    },
    null,
    2
  )}\n`,
  'utf8'
);

run('git', ['add', '.'], tempDir);
const status = run('git', ['status', '--short'], tempDir);
if (status) {
  const message = hadPagesBranch
    ? `docs(pages): publish ${version}`
    : `docs(pages): initialize GitHub Pages with ${version}`;
  run('git', ['commit', '-m', message], tempDir);
}

run('git', ['worktree', 'remove', tempDir, '--force'], root);

console.log(`Published version: ${version}`);
console.log('Branch: gh-pages');
console.log('Root: index.html + 404.html');
console.log(`Archived: versions/${sourceFileName}`);
