import {Buffer} from 'buffer';

/**
 * encode data from string or a Butter with a default encoding of utf8 to
 * base64url
 * see https://www.npmjs.com/package/base64url
 *
 * @param input the input data
 * @param encoding default utf8
 */
function encode(input: string | Buffer, encoding: BufferEncoding = 'utf8'): string {
  if (Buffer.isBuffer(input)) {
    return fromBase64(input.toString('base64'));
  }
  return fromBase64(Buffer.from(input as string, encoding).toString('base64'));
}

function decode(base64Url: string, encoding: string = 'utf8'): string {
  return Buffer.from(toBase64(base64Url), 'base64').toString(encoding);
}

function toBase64(base64Url: string | Buffer): string {
  // We this to be a string so we can do .replace on it. If it's
  // already a string, this is a noop.
  base64Url = base64Url.toString();
  return padString(base64Url)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
}

function fromBase64(base64: string): string {
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function toBuffer(base64Url: string): Buffer {
  return Buffer.from(toBase64(base64Url), 'base64');
}

function fromString(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export interface Base64Url {
  (input: string | Buffer, encoding?: string): string;
  encode(input: string | Buffer, encoding?: string): string;
  decode(base64url: string, encoding?: string): string;
  toBase64(base64url: string | Buffer): string;
  fromBase64(base64: string): string;
  toBuffer(base64url: string): Buffer;
  fromString(str: string): string;
}

const base64url = encode as Base64Url;

base64url.encode = encode;
base64url.decode = decode;
base64url.toBase64 = toBase64;
base64url.fromBase64 = fromBase64;
base64url.toBuffer = toBuffer;
base64url.fromString = fromString;

export default base64url;

function padString(input: string): string {
  const segmentLength = 4;
  const stringLength = input.length;
  const diff = stringLength % segmentLength;

  if (!diff) {
    return input;
  }

  let position = stringLength;
  let padLength = segmentLength - diff;
  const paddedStringLength = stringLength + padLength;
  const buffer = Buffer.alloc(paddedStringLength);

  buffer.write(input);

  while (padLength--) {
    buffer.write('=', position++);
  }

  return buffer.toString();
}