import { createApp } from './app'
import { serve } from '@hono/node-server';

// can be an env variable
const port = 4000;

const app = createApp({ enableCors: true })

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
