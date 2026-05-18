import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan } from '../../../skills/vercel-optimize/lib/scanners/unoptimized-image.mjs';

const f = (path, content) => ({ path, content });

test('unoptimized-image / raw-img: catches bare <img src=...>', () => {
  const findings = scan({
    files: [f('app/page.tsx', '<img src="/hero.png" alt="hero" />')],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'raw-img');
});

test('unoptimized-image / global-unoptimized: catches images.unoptimized: true in next.config.ts', () => {
  const findings = scan({
    files: [f('next.config.ts',
      'export default { images: { unoptimized: true }, reactStrictMode: true };')],
  });
  const hits = findings.filter((x) => x.subtype === 'global-unoptimized');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].file, 'next.config.ts');
  assert.equal(hits[0].trafficIndependent, true);
});

test('unoptimized-image / global-unoptimized: silent on next.config without the flag', () => {
  const findings = scan({
    files: [f('next.config.mjs',
      'export default { images: { remotePatterns: [{ hostname: "cdn.example.com" }] } };')],
  });
  assert.equal(findings.filter((x) => x.subtype === 'global-unoptimized').length, 0);
});

test('unoptimized-image / global-unoptimized: only fires on next.config.* paths', () => {
  const findings = scan({
    files: [
      f('app/some-module.ts', 'const x = { images: { unoptimized: true } };'),
    ],
  });
  assert.equal(findings.length, 0);
});

test('unoptimized-image / image-fill-no-sizes: catches <Image fill /> without sizes', () => {
  const findings = scan({
    files: [
      f('app/gallery.tsx',
        `import Image from 'next/image';\nexport default () => <Image src="/x.jpg" fill alt="x" />;`),
    ],
  });
  const hits = findings.filter((x) => x.subtype === 'image-fill-no-sizes');
  assert.equal(hits.length, 1);
});

test('unoptimized-image / image-fill-no-sizes: SILENT when sizes is present', () => {
  const findings = scan({
    files: [
      f('app/gallery.tsx',
        `import Image from 'next/image';\nexport default () => <Image src="/x.jpg" fill sizes="(max-width: 768px) 100vw, 50vw" alt="x" />;`),
    ],
  });
  assert.equal(findings.filter((x) => x.subtype === 'image-fill-no-sizes').length, 0);
});

test('unoptimized-image / image-fill-no-sizes: SILENT when next/image NOT imported (different Image component)', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `import { Image } from './my-ui';\nexport default () => <Image fill src="/x.jpg" />;`),
    ],
  });
  assert.equal(findings.length, 0);
});

test('unoptimized-image / image-svg-no-unoptimized: catches <Image src="logo.svg" />', () => {
  const findings = scan({
    files: [
      f('app/header.tsx',
        `import Image from 'next/image';\n<Image src="/logo.svg" width={100} height={50} alt="Logo" />`),
    ],
  });
  const hits = findings.filter((x) => x.subtype === 'image-svg-no-unoptimized');
  assert.equal(hits.length, 1);
});

test('unoptimized-image / image-svg-no-unoptimized: SILENT when unoptimized is set', () => {
  const findings = scan({
    files: [
      f('app/header.tsx',
        `import Image from 'next/image';\n<Image src="/logo.svg" width={100} height={50} unoptimized alt="Logo" />`),
    ],
  });
  assert.equal(findings.filter((x) => x.subtype === 'image-svg-no-unoptimized').length, 0);
});

test('unoptimized-image / image-svg-no-unoptimized: SILENT on data: SVG URLs', () => {
  const findings = scan({
    files: [
      f('app/header.tsx',
        `import Image from 'next/image';\n<Image src="data:image/svg+xml;utf8,<svg/>" width={100} height={50} alt="" />`),
    ],
  });
  assert.equal(findings.filter((x) => x.subtype === 'image-svg-no-unoptimized').length, 0);
});

test('unoptimized-image: composite — global flag + fill + svg in one project', () => {
  const findings = scan({
    files: [
      f('next.config.js', 'module.exports = { images: { unoptimized: true } };'),
      f('app/hero.tsx',
        `import Image from 'next/image';\n<Image src="/hero.jpg" fill alt="" />`),
      f('app/icon.tsx',
        `import Image from 'next/image';\n<Image src="/icon.svg" width={32} height={32} alt="" />`),
    ],
  });
  const subtypes = findings.map((x) => x.subtype).sort();
  assert.deepEqual(subtypes, ['global-unoptimized', 'image-fill-no-sizes', 'image-svg-no-unoptimized']);
});
