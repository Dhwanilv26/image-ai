import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const HUGGINGFACE_API_URL =
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large';
const HUGGINGFACE_API_KEY = process.env.HF_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error(
    'Hugging Face API key is missing. Add it to your .env file as HUGGINGFACE_API_KEY.',
  );
}
// chaining is of utmost importance here.. hono()
// then app.get is not allowed

const app = new Hono().post(
  '/generate-image',
  zValidator(
    'json',
    z.object({
      prompt: z.string(),
    }),
  ),
  async (c) => {
    const { prompt } = c.req.valid('json');

    try {
      // Send the prompt to Hugging Face API with default parameters
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt, // Just send the prompt
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
          { status: response.status },
        );
      }

      // Handle the response as an ArrayBuffer (binary data)
      const arrayBuffer = await response.arrayBuffer();
      const base64Image = bufferToBase64(arrayBuffer); // Convert ArrayBuffer to Base64

      // Return the image as Base64-encoded string
      return c.json({
        prompt,
        image: `data:image/png;base64,${base64Image}`, // Default to PNG format
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return c.json(
        { error: 'Something went wrong while generating the image.' },
        { status: 500 },
      );
    }
  },
);

export default app;

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
  return Buffer.from(binary, 'binary').toString('base64');
}
