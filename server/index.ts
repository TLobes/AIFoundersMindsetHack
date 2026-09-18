import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3001;
const app = createApp({ serveClient: process.env.NODE_ENV === 'production' });

app.listen(port, () => {
  const mode = process.env.GEMINI_API_KEY ? `gemini (${process.env.GEMINI_MODEL || 'gemini-2.0-flash'})` : 'guided demo (no AI key)';
  console.log(`otter coach server on http://localhost:${port} — mode: ${mode}`);
});
