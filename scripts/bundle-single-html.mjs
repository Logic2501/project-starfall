import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = process.cwd();
const configPath = resolve(root, 'scripts/bundle.config.json');
const versionPath = resolve(root, 'version.json');
const packagePath = resolve(root, 'package.json');
const distDir = resolve(root, 'dist');

const argv = process.argv.slice(2);
const requestedVersion = argv[0] || null;

const assertSemver = (value) => {
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    throw new Error(`Invalid version: ${value}. Expected x.y.z`);
  }
};

const bumpPatch = (current) => {
  const [major, minor, patch] = current.split('.').map((n) => Number(n));
  return `${major}.${minor}.${patch + 1}`;
};

const compareSemver = (a, b) => {
  const pa = a.split('.').map((n) => Number(n));
  const pb = b.split('.').map((n) => Number(n));
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
};

const maxSemver = (versions) =>
  versions.reduce((acc, v) => (compareSemver(v, acc) > 0 ? v : acc), '0.0.0');

const readDistVersions = async () => {
  try {
    const files = await readdir(distDir);
    return files
      .map((name) => {
        const m = /^starfall-v(\d+\.\d+\.\d+)\.html$/.exec(name);
        return m ? m[1] : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const config = JSON.parse(await readFile(configPath, 'utf8'));
const versionMeta = JSON.parse(await readFile(versionPath, 'utf8'));
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
assertSemver(versionMeta.version);
assertSemver(pkg.version);
const distVersions = await readDistVersions();
const latestVersion = maxSemver([versionMeta.version, pkg.version, ...distVersions]);

let version;
if (requestedVersion) {
  assertSemver(requestedVersion);
  if (compareSemver(requestedVersion, latestVersion) <= 0) {
    throw new Error(`Requested version ${requestedVersion} must be greater than latest ${latestVersion}.`);
  }
  version = requestedVersion;
} else {
  version = bumpPatch(latestVersion);
}

const distFile = resolve(root, `dist/starfall-v${version}.html`);
if (await exists(distFile)) {
  throw new Error(`Refusing to overwrite existing build: ${distFile}`);
}

versionMeta.version = version;
versionMeta.updatedAt = new Date().toISOString().slice(0, 10);
pkg.version = version;
await writeFile(versionPath, `${JSON.stringify(versionMeta, null, 2)}\n`, 'utf8');
await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

const buildStamp = new Date().toISOString();

const template = await readFile(resolve(root, config.template), 'utf8');

const cssChunks = await Promise.all(
  config.css.map(async (p) => {
    const text = await readFile(resolve(root, p), 'utf8');
    return `/* ${p} */\n${text}`;
  })
);

const jsChunks = await Promise.all(
  config.js.map(async (p) => {
    const text = await readFile(resolve(root, p), 'utf8');
    return `// ${p}\n${text}`;
  })
);

const html = template
  .replaceAll('__APP_VERSION__', version)
  .replaceAll('__BUILD_STAMP__', buildStamp)
  .replace('/*__INLINE_CSS__*/', cssChunks.join('\n\n'))
  .replace('//__INLINE_JS__', jsChunks.join('\n\n'));

await mkdir(dirname(distFile), { recursive: true });
await writeFile(distFile, html, 'utf8');

console.log(`Built: ${distFile}`);
console.log(`LatestBeforeBuild: ${latestVersion}`);
console.log(`Version: ${version}`);
console.log(`BuildStamp: ${buildStamp}`);
