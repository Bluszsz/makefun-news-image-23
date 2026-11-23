// "The World in One Day" - a front page for Monday 23 November 2026 (make.fun news-image-20261123).
//
// The finished image is kept beside this file as entry.b64, one line of base64 text, so that every
// file in the repository is plain UTF-8. This program decodes it and writes the bytes to
// /output/entry.png. It reads no clock, no random source and no network, so every run writes the
// same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1_048_576; // the gate's 1 MiB cap
const MAX_SIDE = 1024; // the gate's cap on width and on height
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(reason: string): never {
  console.error(`news-image-23: ${reason}`);
  process.exit(1);
}

// Width and height of a PNG, read from its IHDR chunk; also insists on a closing IEND chunk.
function pngSize(bytes: Buffer): [number, number] {
  if (bytes.length < 45 || bytes.toString('latin1', 12, 16) !== 'IHDR') fail('PNG has no IHDR chunk');
  if (bytes.toString('latin1', bytes.length - 8, bytes.length - 4) !== 'IEND') fail('PNG is cut short (no IEND)');
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

// Width and height of a JPEG, read from its first start-of-frame segment; insists on the end marker.
function jpegSize(bytes: Buffer): [number, number] {
  if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) fail('JPEG is cut short (no end marker)');
  let at = 2;
  while (at + 9 < bytes.length) {
    if (bytes[at] !== 0xff) fail('JPEG segment marker missing');
    const marker = bytes[at + 1];
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return [bytes.readUInt16BE(at + 7), bytes.readUInt16BE(at + 5)];
    at += 2 + bytes.readUInt16BE(at + 2);
  }
  return fail('JPEG has no frame header');
}

const encoded = readFileSync(new URL('./entry.b64', import.meta.url), 'utf8').trim();
if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) fail('entry.b64 is not one line of base64');
const image = Buffer.from(encoded, 'base64');

if (image.length === 0 || image.length > MAX_BYTES) fail(`image is ${image.length} bytes, limit ${MAX_BYTES}`);
const isPng = image.subarray(0, 8).equals(PNG_SIGNATURE);
const isJpeg = image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
if (!isPng && !isJpeg) fail('image is neither a PNG nor a JPEG');

const [width, height] = isPng ? pngSize(image) : jpegSize(image);
if (width < 1 || height < 1 || width > MAX_SIDE || height > MAX_SIDE) fail(`image is ${width}x${height}, limit ${MAX_SIDE}x${MAX_SIDE}`);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
writeFileSync(join(outputDir, 'entry.png'), image);
console.log(`wrote entry.png: ${isPng ? 'PNG' : 'JPEG'} ${width}x${height}, ${image.length} bytes`);
