/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { db } from '@/db/drizzle';
import { projects, projectsInsertSchema } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono()
  // loading all general templates so no specific user templates authentication is required
  .get(
    '/templates',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { page, limit } = c.req.valid('query');

      const data = await db
        .select()
        .from(projects)
        .where(eq(projects.isTemplate, true))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(asc(projects.isPro), desc(projects.updatedAt));

      return c.json({ data });
    },
  )
  .delete(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');

      if (!auth.token?.id) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const data = await db
        .delete(projects)
        .where(and(eq(projects.id, id), eq(projects.userId, auth.token.id)))
        .returning();

      if (data.length === 0) {
        return c.json({ error: 'not found ' }, 404);
      }

      return c.json({ data: { id } });
    },
  )
  .post(
    '/:id/duplicate',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');

      if (!auth.token?.id) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const data = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), eq(projects.userId, auth.token.id)));

      if (data.length === 0) {
        return c.json({ error: 'not found' }, 404);
      }

      const project = data[0];
      const duplicateData = await db
        .insert(projects)
        .values({
          name: `${project.name} copy`,
          json: project.json,
          width: project.width,
          height: project.height,
          userId: auth.token.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return c.json({ data: duplicateData[0] });
    },
  )
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
      }),
    ),
    async (c) => {
      const auth = c.get('authUser');
      const { page, limit } = c.req.valid('query');

      if (!auth.token?.id) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const data = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, auth.token.id))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(projects.updatedAt));

      return c.json({
        data,
        nextPage: data.length === limit ? page + 1 : null,
      });
    },
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      projectsInsertSchema
        .omit({
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial(),
    ),
    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');

      const values = c.req.valid('json');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .update(projects)
        .set({ ...values, updatedAt: new Date() })
        .where(and(eq(projects.id, id), eq(projects.userId, auth.token.id)))
        .returning();

      if (data.length === 0) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      return c.json({ data: data[0] });
    },
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      // writing db query to extract only those projects whose authors are us .. (others cant access our projects)
      const data = await db
        .select()
        .from(projects)
        // selecting the projects equal to the project id in the url and the authors id of that project should be the same which auth js gave it while login
        .where(and(eq(projects.id, id), eq(projects.userId, auth.token.id)));

      if (data.length === 0) {
        return c.json({ error: 'not found' }, 404);
      }

      return c.json({ data: data[0] });
    },
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      // only sending the things that the frontend can provide.. and not the backend like projectid etc
      projectsInsertSchema.pick({
        name: true,
        json: true,
        width: true,
        height: true,
      }),
    ),
    async (c) => {
      const auth = c.get('authUser');
      const { name, json, height, width } = c.req.valid('json');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const data = await db
        .insert(projects)
        .values({
          name,
          json,
          width,
          height,
          userId: auth.token.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning(); // always returns an array like sql

      if (!data[0]) {
        return c.json({ error: 'Something went wrong' }, 400);
      }

      return c.json({ data: data[0] });
    },
  );

export default app;
