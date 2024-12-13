import { unsplash } from '@/lib/unsplash';
import { Hono } from 'hono';

const DEFAULT_COUNT = 50;

const DEFAULT_COLLECTION_IDS = ['317099']; // albumns to select
// creating a route and fetching data from that route

const app = new Hono().get('/', async (c) => {
  // unslpash is just the object having the access key and the fetch method
  const images = await unsplash.photos.getRandom({
    collectionIds: DEFAULT_COLLECTION_IDS,
    count: DEFAULT_COUNT,
  });
  // unsplash apis use errors instead of error.. adjust according to the docs
  if (images.errors) {
    return c.json({ error: 'Something went wrong' }, 400);
  }

  let response = images.response;

  if (!Array.isArray(response)) {
    response = [response]; // turning the response into an array if its not
  }

  return c.json({ data: response });
});

// chaining of creation and request is very necessary
export default app;
