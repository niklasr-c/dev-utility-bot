// Prüft, ob ein String valides JSON ist
export function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}

// Formatiert einen JSON-String (macht ihn hübsch mit Einrückungen)
export function formatJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2); // 2 Leerzeichen Einrückung
  } catch (e) {
    throw new Error('Ungültiges JSON');
  }
}