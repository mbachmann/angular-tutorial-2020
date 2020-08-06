import base64url from './base64url';
import {Buffer} from "buffer";

function base64(s) {
  return Buffer.from(s, 'binary').toString('base64');
}


describe('Helper Base64Url', () => {

  let testBuffer: string;

  beforeEach(() => {
    let array = new Array<string>(256);
    for (let i = 0 ; i < 256 ; i++) array[i] = String.fromCharCode(i);
    let prev = '';
    testBuffer = array.reduce((prev, curr) => {
        prev += curr;
        return prev;
      }
    );
  });

  it('from string to base64url', () => {
    const b64 = base64(testBuffer);
    const b64url = base64url(testBuffer, 'binary');
    expect(b64.indexOf('+')).toEqual(83);
    expect(b64.indexOf('/')).toEqual(255);
    expect(b64.indexOf('=')).toEqual(342);
    expect(b64url.indexOf('+')).toEqual(-1);
    expect(b64url.indexOf('/')).toEqual(-1);
    expect(b64url.indexOf('=')).toEqual(-1);

    expect(b64.indexOf('+')).toEqual(b64url.indexOf('-'));
    expect(b64.indexOf('/')).toEqual(b64url.indexOf('_'));
  });

  it('from base64url to base64', () => {
    const b64 = base64(testBuffer);
    const b64url = base64url(testBuffer, 'binary');
    const result = base64url.toBase64(b64url);
    expect(result).toBe(b64);
  });

  it('from base64 to base64url', () => {
    const b64 = base64(testBuffer);
    const b64url = base64url(testBuffer, 'binary');
    const result = base64url.fromBase64(b64);
    expect(result).toBe(b64url);
  });

  it('from base64url to string', () => {
    const b64url = base64url(testBuffer, 'binary');
    const result = base64url.decode(b64url, 'binary');
    expect(result).toEqual(testBuffer);
  });

  it('from base64url to string (buffer)', () => {
    const b64url = base64url(testBuffer, 'binary');
    const result = base64url.decode(Buffer.from(b64url).toString(), 'binary');
    expect(result).toEqual(testBuffer);
  });
});
