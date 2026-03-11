import { describe, it, expect } from 'vitest';
import { isValidJson, formatJson } from '../src/utils/json';

describe('JSON Utility', () => {
  it('sollte valides JSON erkennen', () => {
    const validJson = '{"name": "Bot", "version": "1.0"}';
    expect(isValidJson(validJson)).toBe(true);
  });

  it('sollte kaputtes JSON ablehnen', () => {
    const invalidJson = '{"name": "Bot", "version": "1.0"'; // Fehlende Klammer am Ende
    expect(isValidJson(invalidJson)).toBe(false);
  });

  it('sollte JSON korrekt formatieren', () => {
    const unformatted = '{"test":true}';
    const expected = '{\n  "test": true\n}';
    expect(formatJson(unformatted)).toBe(expected);
  });

  it('sollte beim Formatieren von kaputtem JSON einen Fehler werfen', () => {
    const invalidJson = '{"test":true';
    expect(() => formatJson(invalidJson)).toThrow('Ungültiges JSON');
  });
});