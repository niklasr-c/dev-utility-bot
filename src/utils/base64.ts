export function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64');
}

export function decodeBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8');
}