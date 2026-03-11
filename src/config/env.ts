import { z } from 'zod';
import 'dotenv/config';

// 1. Wir definieren, wie unsere Umgebungsvariablen aussehen MÜSSEN
const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "Discord Token fehlt!"),
  DATABASE_URL: z.string().min(1, "Database URL fehlt!"), // <-- NEU!
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

// 2. Wir parsen die echten Variablen gegen unser Schema
const _env = envSchema.safeParse(process.env);

// 3. Wenn was fehlt, stoppen wir den Bot SOFORT und zeigen einen sauberen Fehler
if (!_env.success) {
  console.error('❌ Ungültige Environment Variablen:\n', _env.error.format());
  process.exit(1); 
}

// 4. Wir exportieren die validierten, typensicheren Variablen
export const env = _env.data;