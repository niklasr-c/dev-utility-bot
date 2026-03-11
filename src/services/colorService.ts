import { createCanvas } from '@napi-rs/canvas';

export function generateColorImage(hexColor: string): Buffer {
  // Wir erstellen eine quadratische Leinwand (300x300 Pixel)
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');

  // Wir füllen die komplette Leinwand mit der übergebenen Farbe
  ctx.fillStyle = hexColor;
  ctx.fillRect(0, 0, 300, 300);

  // Wir exportieren das fertige Bild als PNG-Datenblock (Buffer)
  return canvas.toBuffer('image/png');
}