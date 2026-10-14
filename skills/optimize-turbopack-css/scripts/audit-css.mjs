#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const SKIP_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules'
]);

function walk(root, extensions, allowSkippedRoot = false) {
  if (!existsSync(root)) {
    throw new Error(`Path does not exist: ${root}`);
  }

  const files = [];
  const visit = (directory, isRoot = false) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (
          (!isRoot || !allowSkippedRoot) &&
          SKIP_DIRECTORIES.has(entry.name)
        ) {
          continue;
        }
        visit(path);
      } else if (
        entry.isFile() &&
        extensions.some((ext) => entry.name.endsWith(ext))
      ) {
        files.push(path);
      }
    }
  };

  const stats = statSync(root);
  if (stats.isFile()) {
    if (extensions.some((ext) => root.endsWith(ext))) files.push(root);
  } else {
    visit(root, true);
  }

  return files.sort();
}

function count(text, expression) {
  return [...text.matchAll(expression)].length;
}

function splitSelectors(prelude) {
  const selectors = [];
  let current = '';
  let quote = null;
  let escaped = false;
  let parentheses = 0;
  let brackets = 0;

  for (const character of prelude) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      current += character;
      escaped = true;
      continue;
    }
    if (quote) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      current += character;
      quote = character;
      continue;
    }
    if (character === '(') parentheses += 1;
    if (character === ')') parentheses = Math.max(0, parentheses - 1);
    if (character === '[') brackets += 1;
    if (character === ']') brackets = Math.max(0, brackets - 1);

    if (character === ',' && parentheses === 0 && brackets === 0) {
      if (current.trim()) selectors.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  if (current.trim()) selectors.push(current.trim());
  return selectors;
}

function selectorMetrics(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blockPrelude = /([^{}]+)\{/g;
  const selectors = new Map();
  let match;
  let selectorCharacters = 0;
  let ruleBlocks = 0;

  while ((match = blockPrelude.exec(withoutComments)) !== null) {
    const prelude = match[1].trim();
    if (!prelude || prelude.startsWith('@') || prelude.includes(';')) continue;
    ruleBlocks += 1;
    selectorCharacters += Buffer.byteLength(prelude);
    for (const selector of splitSelectors(prelude)) {
      selectors.set(selector, (selectors.get(selector) ?? 0) + 1);
    }
  }

  return {
    ruleBlocks,
    selectorOccurrences: [...selectors.values()].reduce(
      (sum, value) => sum + value,
      0
    ),
    uniqueSelectors: selectors.size,
    selectorCharacters,
    duplicatedSelectors: [...selectors.values()].filter((value) => value > 1)
      .length,
    extraSelectorOccurrences: [...selectors.values()].reduce(
      (sum, value) => sum + Math.max(0, value - 1),
      0
    )
  };
}

function markerMetrics(css) {
  return {
    lang: count(css, /:lang\(/g),
    dir: count(css, /:dir\(/g),
    is: count(css, /:is\(/g),
    webkitAny: count(css, /:-webkit-any\(/g),
    mozAny: count(css, /:-moz-any\(/g),
    lightDark: count(css, /--lightningcss-(?:light|dark)\b/g),
    lab: count(css, /\blab\(/g),
    logicalProperties: count(
      css,
      /\b(?:block-size|inline-size|min-block-size|max-block-size|min-inline-size|max-inline-size|inset-(?:block|inline)(?:-(?:start|end))?|margin-(?:block|inline)(?:-(?:start|end))?|padding-(?:block|inline)(?:-(?:start|end))?|border-(?:block|inline)(?:-(?:start|end))?(?:-(?:color|style|width))?|border-(?:start|end)-(?:start|end)-radius)\s*:/g
    )
  };
}

// Turbopack (through Next.js 16.3.x) names CSS Modules classes
// `[name]__[hash]__[local]`, where `[name]` ends in `-module`, and
// `.module.scss` files get a doubled `-module-scss-module` segment:
//   .index-module__KWKY6G__redText              Turbopack, .module.css
//   .Details-module-scss-module__MGoXJG__label  Turbopack, .module.scss
//   .index_redText__honUV                       webpack, not counted
// The same names repeat in CSS, HTML class attributes, and RSC payloads, so
// this runs on CSS assets and on prerendered documents. Overhead is measured
// against webpack's `[name]_[local]__[hash5]` name for the same class, so it
// reads directly as the gap to webpack parity.
function classNameMetrics(text) {
  let occurrences = 0;
  let sassOccurrences = 0;
  let overheadBytes = 0;
  const pattern =
    /(?<![\w-])([\w-]+?)-module(-s[ac]ss-module)?__[\w-]{4,12}?__([\w-]+)/g;
  for (const [name, base, sass, local] of text.matchAll(pattern)) {
    occurrences += 1;
    if (sass) sassOccurrences += 1;
    overheadBytes += name.length - (base.length + local.length + 8);
  }
  return { occurrences, sassOccurrences, overheadBytes };
}

function sumClassNames(items) {
  return {
    occurrences: sumObjects(items, 'occurrences'),
    sassOccurrences: sumObjects(items, 'sassOccurrences'),
    overheadBytes: sumObjects(items, 'overheadBytes')
  };
}

function compressedSizes(buffer) {
  return {
    raw: buffer.length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    brotli: brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
    }).length
  };
}

function addCompressedSizes(left, right) {
  return {
    raw: left.raw + right.raw,
    gzip: left.gzip + right.gzip,
    brotli: left.brotli + right.brotli
  };
}

function totalForPaths(paths, assetsByPath) {
  return [...new Set(paths)].reduce(
    (total, assetPath) => {
      const asset = assetsByPath.get(assetPath);
      return asset ? addCompressedSizes(total, asset) : total;
    },
    { raw: 0, gzip: 0, brotli: 0 }
  );
}

function sumObjects(items, key) {
  return items.reduce((sum, item) => sum + item[key], 0);
}

function analyzeCss(label, inputPath) {
  const absolutePath = resolve(inputPath);
  const files = walk(absolutePath, ['.css'], true);
  const assets = files.map((file) => {
    const buffer = readFileSync(file);
    const css = buffer.toString('utf8');
    return {
      file: relative(absolutePath, file) || basename(file),
      hash: createHash('sha256').update(buffer).digest('hex'),
      ...compressedSizes(buffer),
      ...selectorMetrics(css),
      markers: markerMetrics(css),
      classNames: classNameMetrics(css)
    };
  });

  const hashGroups = new Map();
  for (const asset of assets) {
    const group = hashGroups.get(asset.hash) ?? [];
    group.push(asset.file);
    hashGroups.set(asset.hash, group);
  }

  const markerKeys = [
    'lang',
    'dir',
    'is',
    'webkitAny',
    'mozAny',
    'lightDark',
    'lab',
    'logicalProperties'
  ];
  const markers = Object.fromEntries(
    markerKeys.map((key) => [
      key,
      assets.reduce((sum, asset) => sum + asset.markers[key], 0)
    ])
  );

  return {
    label,
    path: absolutePath,
    files: assets.length,
    raw: sumObjects(assets, 'raw'),
    gzip: sumObjects(assets, 'gzip'),
    brotli: sumObjects(assets, 'brotli'),
    ruleBlocks: sumObjects(assets, 'ruleBlocks'),
    selectorOccurrences: sumObjects(assets, 'selectorOccurrences'),
    uniqueSelectorsByAsset: sumObjects(assets, 'uniqueSelectors'),
    selectorCharacters: sumObjects(assets, 'selectorCharacters'),
    duplicatedSelectorsByAsset: sumObjects(assets, 'duplicatedSelectors'),
    extraSelectorOccurrencesByAsset: sumObjects(
      assets,
      'extraSelectorOccurrences'
    ),
    markers,
    classNames: sumClassNames(assets.map((asset) => asset.classNames)),
    exactDuplicateAssetGroups: [...hashGroups.values()].filter(
      (group) => group.length > 1
    ),
    largestAssets: assets
      .sort((left, right) => right.raw - left.raw)
      .slice(0, 25)
      .map(({ hash, ...asset }) => asset)
  };
}

function parseJsonObjectAt(source, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error('Unterminated JSON object in client reference manifest');
}

function parseClientReferenceManifest(file) {
  const source = readFileSync(file, 'utf8');
  const assignment = source.match(/__RSC_MANIFEST\["([^"]+)"\]\s*=\s*/);
  if (!assignment || assignment.index === undefined) return null;

  const objectStart = source.indexOf(
    '{',
    assignment.index + assignment[0].length
  );
  if (objectStart === -1) return null;

  const manifest = JSON.parse(parseJsonObjectAt(source, objectStart));
  const cssPaths = new Set();
  const appliedCssPaths = new Set();
  const inlinedCssPaths = new Set();

  for (const [entry, files] of Object.entries(manifest.entryCSSFiles ?? {})) {
    const normalizedEntry = entry.replaceAll('\\', '/');
    const isBuiltInGlobalError =
      normalizedEntry.includes('/node_modules/next/') &&
      normalizedEntry.includes('/global-error');
    if (isBuiltInGlobalError) continue;

    const isErrorBoundary =
      /(?:^|\/)(?:global-)?error(?:\.[^/]*)?$/.test(normalizedEntry);

    for (const cssFile of files) {
      const assetPath =
        typeof cssFile === 'string' ? cssFile : cssFile?.path;
      if (!assetPath) continue;

      if (typeof cssFile === 'object' && cssFile.inlined) {
        inlinedCssPaths.add(assetPath);
        continue;
      }

      cssPaths.add(assetPath);
      if (!isErrorBoundary) appliedCssPaths.add(assetPath);
    }
  }

  const route = assignment[1].replace(/\/page$/, '') || '/';
  return {
    route,
    cssPaths: [...cssPaths].sort(),
    appliedCssPaths: [...appliedCssPaths].sort(),
    inlinedCssPaths: [...inlinedCssPaths].sort()
  };
}

function intersectRoutePaths(routes, key) {
  if (routes.length === 0) return [];
  return routes[0][key].filter((assetPath) =>
    routes.every((route) => route[key].includes(assetPath))
  );
}

function analyzeNextBuild(label, inputPath) {
  const buildRoot = resolve(inputPath);
  const staticRoot = join(buildRoot, 'static');
  const serverAppRoot = join(buildRoot, 'server', 'app');
  const css = analyzeCss(label, staticRoot);
  const assetsByPath = new Map(
    walk(staticRoot, ['.css'], true).map((file) => [
      `static/${relative(staticRoot, file).replaceAll('\\', '/')}`,
      compressedSizes(readFileSync(file))
    ])
  );
  const routesByName = new Map();

  if (existsSync(serverAppRoot)) {
    for (const manifestFile of walk(
      serverAppRoot,
      ['_client-reference-manifest.js']
    )) {
      const route = parseClientReferenceManifest(manifestFile);
      if (
        !route ||
        (route.cssPaths.length === 0 && route.inlinedCssPaths.length === 0)
      ) {
        continue;
      }

      const existing = routesByName.get(route.route) ?? {
        cssPaths: [],
        appliedCssPaths: [],
        inlinedCssPaths: []
      };
      routesByName.set(route.route, {
        cssPaths: [...new Set([...existing.cssPaths, ...route.cssPaths])],
        appliedCssPaths: [
          ...new Set([...existing.appliedCssPaths, ...route.appliedCssPaths])
        ],
        inlinedCssPaths: [
          ...new Set([...existing.inlinedCssPaths, ...route.inlinedCssPaths])
        ]
      });
    }
  }

  const routes = [...routesByName]
    .map(([route, routeAssets]) => {
      const cssPaths = routeAssets.cssPaths.sort();
      const appliedCssPaths = routeAssets.appliedCssPaths.sort();
      const preloadedOnlyCssPaths = cssPaths.filter(
        (assetPath) => !appliedCssPaths.includes(assetPath)
      );
      const missingCssPaths = cssPaths.filter(
        (assetPath) => !assetsByPath.has(assetPath)
      );

      return {
        route,
        cssPaths,
        appliedCssPaths,
        preloadedOnlyCssPaths,
        missingCssPaths,
        inlinedCssPaths: routeAssets.inlinedCssPaths.sort(),
        applied: totalForPaths(appliedCssPaths, assetsByPath),
        preloadedOnly: totalForPaths(preloadedOnlyCssPaths, assetsByPath),
        ...totalForPaths(cssPaths, assetsByPath)
      };
    })
    .sort((left, right) => right.raw - left.raw);

  const commonCssPaths = intersectRoutePaths(routes, 'cssPaths');
  const commonAppliedCssPaths = intersectRoutePaths(
    routes,
    'appliedCssPaths'
  );
  const missingAssetPaths = [
    ...new Set(routes.flatMap((route) => route.missingCssPaths))
  ].sort();

  const documents = (
    existsSync(serverAppRoot) ? walk(serverAppRoot, ['.html', '.rsc']) : []
  ).map((file) => {
    const text = readFileSync(file, 'utf8');
    return { raw: Buffer.byteLength(text), ...classNameMetrics(text) };
  });

  return {
    ...css,
    path: buildRoot,
    cssPath: staticRoot,
    documents: {
      source: 'Prerendered HTML and RSC files under server/app',
      files: documents.length,
      raw: sumObjects(documents, 'raw'),
      ...sumClassNames(documents)
    },
    routeCss: {
      source: 'Next.js entryCSSFiles (internal manifest attribution)',
      routes: routes.length,
      missingAssetPaths,
      common: {
        cssPaths: commonCssPaths,
        ...totalForPaths(commonCssPaths, assetsByPath)
      },
      commonApplied: {
        cssPaths: commonAppliedCssPaths,
        ...totalForPaths(commonAppliedCssPaths, assetsByPath)
      },
      largestRoutes: routes.slice(0, 25)
    }
  };
}

function analyzeScss(inputPath) {
  const absolutePath = resolve(inputPath);
  const files = walk(absolutePath, ['.scss', '.sass']);
  const imports = new Map();
  const details = files.map((file) => {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(
      /@(use|forward|import)\s+['"]([^'"]+)['"]/g
    )) {
      const key = `${match[1]} ${match[2]}`;
      imports.set(key, (imports.get(key) ?? 0) + 1);
    }
    return {
      file: relative(absolutePath, file) || basename(file),
      bytes: Buffer.byteLength(source),
      module: /\.module\.s[ac]ss$/.test(file),
      use: count(source, /@use\b/g),
      forward: count(source, /@forward\b/g),
      import: count(source, /@import\b/g),
      each: count(source, /@each\b/g),
      for: count(source, /@for\b/g),
      while: count(source, /@while\b/g)
    };
  });

  return {
    path: absolutePath,
    files: details.length,
    modules: details.filter((file) => file.module).length,
    bytes: sumObjects(details, 'bytes'),
    directives: {
      use: sumObjects(details, 'use'),
      forward: sumObjects(details, 'forward'),
      import: sumObjects(details, 'import')
    },
    generators: {
      each: sumObjects(details, 'each'),
      for: sumObjects(details, 'for'),
      while: sumObjects(details, 'while')
    },
    largestSources: details
      .sort((left, right) => right.bytes - left.bytes)
      .slice(0, 25),
    generatorSources: details
      .filter((file) => file.each + file.for + file.while > 0)
      .sort(
        (left, right) =>
          right.each +
          right.for +
          right.while -
          (left.each + left.for + left.while)
      ),
    commonDependencies: [...imports.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 40)
      .map(([dependency, occurrences]) => ({ dependency, occurrences }))
  };
}

function parseArgs(args) {
  const options = {
    css: [],
    nextBuild: [],
    scss: [],
    json: null,
    selfTest: false
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--self-test') {
      options.selfTest = true;
    } else if (argument === '--css') {
      const value = args[++index];
      if (!value) throw new Error('--css requires [label=]path');
      const separator = value.indexOf('=');
      options.css.push(
        separator > 0
          ? {
              label: value.slice(0, separator),
              path: value.slice(separator + 1)
            }
          : { label: basename(resolve(value)), path: value }
      );
    } else if (argument === '--scss') {
      const value = args[++index];
      if (!value) throw new Error('--scss requires a path');
      options.scss.push(value);
    } else if (argument === '--next-build') {
      const value = args[++index];
      if (!value) throw new Error('--next-build requires [label=]path');
      const separator = value.indexOf('=');
      options.nextBuild.push(
        separator > 0
          ? {
              label: value.slice(0, separator),
              path: value.slice(separator + 1)
            }
          : { label: basename(resolve(value)), path: value }
      );
    } else if (argument === '--json') {
      options.json = args[++index];
      if (!options.json) throw new Error('--json requires a path');
    } else if (argument === '--help' || argument === '-h') {
      return {
        help: true,
        css: [],
        nextBuild: [],
        scss: [],
        json: null,
        selfTest: false
      };
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function printReport(report) {
  for (const css of report.css) {
    console.error(`\nCSS ${css.label} (${css.path})`);
    console.error(
      `  files=${css.files} raw=${formatBytes(css.raw)} gzip=${formatBytes(css.gzip)} brotli=${formatBytes(css.brotli)}`
    );
    console.error(
      `  rules=${css.ruleBlocks} selectors=${css.selectorOccurrences} selectorChars=${css.selectorCharacters}`
    );
    console.error(
      `  markers lang=${css.markers.lang} dir=${css.markers.dir} is=${css.markers.is} webkitAny=${css.markers.webkitAny} mozAny=${css.markers.mozAny} lightDark=${css.markers.lightDark} lab=${css.markers.lab} logical=${css.markers.logicalProperties}`
    );
    console.error(
      `  classNames modules=${css.classNames.occurrences} scss=${css.classNames.sassOccurrences} overhead=${formatBytes(css.classNames.overheadBytes)}`
    );
    if (css.exactDuplicateAssetGroups.length > 0) {
      console.error(
        `  exact duplicate asset groups=${css.exactDuplicateAssetGroups.length}`
      );
    }
    for (const asset of css.largestAssets.slice(0, 10)) {
      console.error(
        `    ${formatBytes(asset.raw).padStart(10)}  ${formatBytes(asset.gzip).padStart(10)} gzip  ${asset.file}`
      );
    }
    if (css.documents) {
      console.error(
        `  documents files=${css.documents.files} raw=${formatBytes(css.documents.raw)} classNames=${css.documents.occurrences} scss=${css.documents.sassOccurrences} overhead=${formatBytes(css.documents.overheadBytes)}`
      );
    }
    if (css.routeCss) {
      console.error(
        `  manifest routes=${css.routeCss.routes} common=${formatBytes(css.routeCss.common.raw)} commonApplied=${formatBytes(css.routeCss.commonApplied.raw)}`
      );
      if (css.routeCss.missingAssetPaths.length > 0) {
        console.error(
          `  warning: manifest CSS assets missing from static output=${css.routeCss.missingAssetPaths.length}`
        );
      }
      for (const route of css.routeCss.largestRoutes.slice(0, 10)) {
        console.error(
          `    route=${formatBytes(route.raw).padStart(10)} preloadOnly=${formatBytes(route.preloadedOnly.raw).padStart(10)} ${route.route}`
        );
      }
    }
  }

  for (const scss of report.scss) {
    console.error(`\nSCSS (${scss.path})`);
    console.error(
      `  files=${scss.files} modules=${scss.modules} bytes=${formatBytes(scss.bytes)} use=${scss.directives.use} forward=${scss.directives.forward} import=${scss.directives.import}`
    );
    console.error(
      `  generators each=${scss.generators.each} for=${scss.generators.for} while=${scss.generators.while}`
    );
    for (const source of scss.generatorSources.slice(0, 10)) {
      console.error(
        `    loops=${source.each + source.for + source.while} bytes=${source.bytes} ${source.file}`
      );
    }
  }
}

function printHelp() {
  console.error(`Usage:
  node audit-css.mjs --css [label=]PATH [--css ...] [--scss PATH ...] [--json FILE]
  node audit-css.mjs --next-build [label=]PATH [--next-build ...] [--scss PATH ...] [--json FILE]
  node audit-css.mjs --self-test

Examples:
  node audit-css.mjs --css turbo=.next/static --scss app --scss components
  node audit-css.mjs --next-build turbo=.next --scss app --json /tmp/report.json
  node audit-css.mjs --css turbo=/tmp/turbo/static --css webpack=/tmp/webpack/static --json /tmp/report.json`);
}

function selfTest() {
  const directory = mkdtempSync(join(tmpdir(), 'audit-css-'));
  try {
    const cssDirectory = join(directory, 'css');
    const scssDirectory = join(directory, 'scss');
    const nextBuildDirectory = join(directory, '.next');
    const nextStaticDirectory = join(nextBuildDirectory, 'static', 'chunks');
    const nextServerDirectory = join(
      nextBuildDirectory,
      'server',
      'app',
      'home'
    );
    const nextServerAboutDirectory = join(
      nextBuildDirectory,
      'server',
      'app',
      'about'
    );
    mkdirSync(cssDirectory);
    mkdirSync(scssDirectory);
    mkdirSync(nextStaticDirectory, { recursive: true });
    mkdirSync(nextServerDirectory, { recursive: true });
    mkdirSync(nextServerAboutDirectory, { recursive: true });
    writeFileSync(
      join(cssDirectory, 'main.css'),
      '.a:lang(ar){margin-inline-start:1rem}.b:-webkit-any(:lang(ar)){color:red}'
    );
    writeFileSync(
      join(scssDirectory, 'main.scss'),
      "@use 'tokens';\n@each $x in 1, 2 { .x-#{$x} { width: $x * 1px; } }"
    );
    writeFileSync(join(scssDirectory, '_tokens.scss'), '$space: 1rem;');
    writeFileSync(join(nextStaticDirectory, 'global.css'), '.global{margin:0}');
    writeFileSync(join(nextStaticDirectory, 'error.css'), '.error{color:red}');
    writeFileSync(join(nextStaticDirectory, 'home.css'), '.home{color:blue}');
    writeFileSync(join(nextStaticDirectory, 'about.css'), '.about{color:green}');
    writeFileSync(join(nextStaticDirectory, 'inline.css'), '.inline{display:none}');
    writeFileSync(
      join(nextServerDirectory, 'page_client-reference-manifest.js'),
      'globalThis.__RSC_MANIFEST["/home/page"] = {"entryCSSFiles":{' +
        '"[project]/app/layout":[{"path":"static/chunks/global.css","inlined":false}],' +
        '"[project]/app/error":[{"path":"static/chunks/error.css","inlined":false}],' +
        '"[project]/app/home/page":[{"path":"static/chunks/home.css","inlined":false},' +
        '{"path":"static/chunks/inline.css","inlined":true}]}};'
    );
    writeFileSync(
      join(nextServerAboutDirectory, 'page_client-reference-manifest.js'),
      'globalThis.__RSC_MANIFEST["/about/page"] = {"entryCSSFiles":{' +
        '"[project]/app/layout":[{"path":"static/chunks/global.css","inlined":false}],' +
        '"[project]/app/error":[{"path":"static/chunks/error.css","inlined":false}],' +
        '"[project]/app/about/page":[{"path":"static/chunks/about.css","inlined":false}],' +
        '"[project]/node_modules/next/dist/client/components/builtin/global-error":' +
        '[{"path":"static/chunks/builtin.css","inlined":false}]}};'
    );

    writeFileSync(
      join(nextBuildDirectory, 'server', 'app', 'home.html'),
      '<div class="index-module__KWKY6G__redText ' +
        'Details-module-scss-module__MGoXJG__label">Home</div>'
    );

    const css = analyzeCss('test', cssDirectory);
    const scss = analyzeScss(scssDirectory);
    const nextBuild = analyzeNextBuild('next-test', nextBuildDirectory);
    assert.equal(css.files, 1);
    assert.equal(css.markers.lang, 2);
    assert.equal(css.markers.webkitAny, 1);
    assert.equal(css.markers.logicalProperties, 1);
    assert.equal(scss.files, 2);
    assert.equal(scss.generators.each, 1);
    assert.equal(scss.directives.use, 1);
    const homeRoute = nextBuild.routeCss.largestRoutes.find(
      (route) => route.route === '/home'
    );
    assert.equal(nextBuild.routeCss.routes, 2);
    assert.deepEqual(nextBuild.routeCss.missingAssetPaths, []);
    assert.equal(homeRoute.cssPaths.length, 3);
    assert.equal(
      homeRoute.preloadedOnlyCssPaths[0],
      'static/chunks/error.css'
    );
    assert.equal(homeRoute.appliedCssPaths.length, 2);
    assert.deepEqual(homeRoute.inlinedCssPaths, [
      'static/chunks/inline.css'
    ]);
    assert.deepEqual(nextBuild.routeCss.common.cssPaths, [
      'static/chunks/error.css',
      'static/chunks/global.css'
    ]);
    assert.deepEqual(nextBuild.routeCss.commonApplied.cssPaths, [
      'static/chunks/global.css'
    ]);
    const colorMarkers = markerMetrics(
      ':root{--lightningcss-light:initial;--lightningcss-dark: }' +
        '.a{color:lab(50% 1 2);background:oklab(50% 0 0)}'
    );
    assert.equal(colorMarkers.lightDark, 2);
    assert.equal(colorMarkers.lab, 1);
    assert.equal(nextBuild.documents.files, 1);

    const classNames = classNameMetrics(
      '.index-module__KWKY6G__redText{color:red}' +
        '.Details-module-scss-module__MGoXJG__label{color:blue}' +
        '.index_redText__honUV{color:green}'
    );
    assert.equal(classNames.occurrences, 2);
    assert.equal(classNames.sassOccurrences, 1);
    assert.ok(classNames.overheadBytes > 0);
    assert.equal(nextBuild.documents.occurrences, 2);
    console.error('Self-test passed.');
    console.log(JSON.stringify({ success: true, selfTest: true }));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    console.log(JSON.stringify({ success: true, help: true }));
    return;
  }
  if (options.selfTest) {
    selfTest();
    return;
  }
  if (
    options.css.length === 0 &&
    options.nextBuild.length === 0 &&
    options.scss.length === 0
  ) {
    printHelp();
    throw new Error(
      'At least one --css, --next-build, or --scss path is required'
    );
  }

  const report = {
    success: true,
    css: [
      ...options.css.map(({ label, path }) => analyzeCss(label, path)),
      ...options.nextBuild.map(({ label, path }) =>
        analyzeNextBuild(label, path)
      )
    ],
    scss: options.scss.map(analyzeScss)
  };
  printReport(report);
  if (options.json)
    writeFileSync(
      resolve(options.json),
      `${JSON.stringify(report, null, 2)}\n`
    );
  console.log(JSON.stringify(report));
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  console.log(JSON.stringify({ success: false, error: message }));
  process.exitCode = 1;
}
