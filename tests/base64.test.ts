import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from '../src/utils/base64';

describe('Base64 Utility', () => {
  it('sollte normalen Text in Base64 encoden', () => {
    const input = 'Hallo Welt';
    const expected = 'SGFsbG8gV2VsdA==';
    expect(encodeBase64(input)).toBe(expected);
  });

  it('sollte Base64 zurück in Text decoden', () => {
    const input = 'SGFsbG8gV2VsdA==';
    const expected = 'Hallo Welt';
    expect(decodeBase64(input)).toBe(expected);
  });
});