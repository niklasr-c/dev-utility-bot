import { describe, it, expect } from 'vitest';
import { testRegex } from '../src/utils/regex';

describe('Regex Utility', () => {
  it('sollte alle Zahlen im Text finden', () => {
    // Wir suchen nach \d+ (alle Zahlen)
    const result = testRegex('\\d+', 'Ich habe 3 Äpfel und 12 Birnen');
    expect(result.isValid).toBe(true);
    expect(result.matches).toEqual(['3', '12']);
  });

  it('sollte einen Fehler bei ungültigem Regex werfen, aber nicht abstürzen', () => {
    // Ungültiges Pattern: offene eckige Klammer
    const result = testRegex('[a-', 'Test Text');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});