import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createApp } from './app.js';

if (existsSync('.env')) loadEnvFile('.env');

const port = Number(process.env.PORT) || 3001;
const app = createApp({ serveClient: process.env.NODE_ENV === 'production' });

app.listen(port, () => {
  const mode = process.env.GEMINI_API_KEY ? `gemini (${process.env.GEMINI_MODEL || 'gemini-2.0-flash'})` : 'guided demo (no AI key)';
  console.log(`otter coach server on http://localhost:${port} — mode: ${mode}`);
});
