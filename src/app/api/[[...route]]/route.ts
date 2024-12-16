/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import { AuthConfig, initAuthConfig } from '@hono/auth-js';

import ai from './ai';
import images from './images';
import users from './users';


import authConfig from '@/auth.config';

export const runtime = 'nodejs';

function getAuthConfig(c: Context): AuthConfig {
  // @ts-ignore
 
  return {
    secret: process.env.AUTH_SECRET ,
    ...authConfig
  };
};

const app = new Hono().basePath('/api');

app.use("*",initAuthConfig(getAuthConfig))

const routes = app
  .route('/ai', ai)
  .route('/users', users)
  .route('/images', images);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type Apptype = typeof routes;
