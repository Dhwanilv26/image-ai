import { Hono } from 'hono';

const app = new Hono().get('/', async (c) => {
  return c.json({ data: { images: [] } });
});

// chaining of creation and request is very necessary
export default app;