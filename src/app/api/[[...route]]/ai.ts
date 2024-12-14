import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const HUGGINGFACE_GENERATE_URL =
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large';
const HUGGINGFACE_REMOVE_BG_URL =
  'https://api-inference.huggingface.co/models/not-lain/rembg';

const HUGGINGFACE_API_KEY = process.env.HF_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error(
    'Hugging Face API key is missing. Add it to your .env file as HUGGINGFACE_API_KEY.'
  );
}

const app = new Hono()
  // Endpoint: Remove Background
  .post(
    '/remove-bg',
    zValidator(
      'json',
      z.object({
        image: z.string(), 
      })
    ),
    async (c) => {
      const { image } = c.req.valid('json');

      try {
        const response = await fetch(HUGGINGFACE_REMOVE_BG_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: image, 
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          return c.json(
            {
              error: `Failed to remove background: ${
                error.error || response.statusText
              }`,
            },
            { status: response.status }
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64Image = bufferToBase64(arrayBuffer);

        return c.json({
          original: image,
          background_removed: `data:image/png;base64,${base64Image}`,
        });
      } catch (error) {
        console.error('Error removing background:', error);
        return c.json(
          { error: 'Something went wrong while removing the background.' },
          { status: 500 }
        );
      }
    }
  )

  .post(
    '/generate-image',
    zValidator(
      'json',
      z.object({
        prompt: z.string(), 
      })
    ),
    async (c) => {
      const { prompt } = c.req.valid('json');

      try {
        const response = await fetch(HUGGINGFACE_GENERATE_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt, 
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          return c.json(
            {
              error: `Failed to generate image: ${
                error.error || response.statusText
              }`,
            },
            { status: response.status }
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64Image = bufferToBase64(arrayBuffer);

        return c.json({
          prompt,
          image: `data:image/png;base64,${base64Image}`, // Encoded image
        });
      } catch (error) {
        console.error('Error generating image:', error);
        return c.json(
          { error: 'Something went wrong while generating the image.' },
          { status: 500 }
        );
      }
    }
  );

export default app;

function bufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
  return Buffer.from(binary, 'binary').toString('base64');
}
