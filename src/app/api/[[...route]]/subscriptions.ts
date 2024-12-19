/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';

import { stripe } from '@/lib/stripe';

import Stripe from 'stripe';
import { db } from '@/db/drizzle';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkIsActive } from '@/features/subscriptions/lib';

const app = new Hono()
  .post('/billing', verifyAuth(), async (c) => {
    const auth = c.get('authUser');

    if (!auth.token?.id) {
      return c.json({ error: 'unauthorized' }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    if (!subscription) {
      return c.json({ error: 'No subscription found' }, 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });

    if (!session.url) {
      return c.json({ error: 'failed to create session' }, 400);
    }

    return c.json({ data: session.url });
  })
  .get('/current', verifyAuth(), async (c) => {
    const auth = c.get('authUser');

    if (!auth.token?.id) {
      return c.json({ error: 'unauthorized' }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    const active = checkIsActive(subscription);

    // @ts-nocheck
    return c.json({
      data: {
        ...subscription,
        active,
      },
    });
  })
  .post('/checkout', verifyAuth(), async (c) => {
    const auth = c.get('authUser');

    // giving data accesss to db

    if (!auth.token?.id) {
      return c.json({ error: 'unauthorized' }, 401);
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=1`,

      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'required',
      customer_email: auth.token.email || '',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      metadata: {
        userId: auth.token.id,
      },
    });

    const url = session.url;

    if (!url) {
      return c.json({ error: 'failed to create session' }, 400);
    }

    return c.json({ data: url });
  })
  // we arent accessing this webhook , stripe is so no verifauth is needed here
  .post('/webhook', async (c) => {
    const body = await c.req.text();
    const signature = c.req.header('Stripe-Signature') as string;

    // giving data acccess to stripe for authentication and payment procedure
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      return c.json({ error: 'invalid signature' }, 400);
    }

    const session = event.data.object as Stripe.Checkout.Session;
    // user purchases for the first time
    if (event.type === 'checkout.session.completed') {
      // subscription is created in the stripe platform
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        // means that we are unaware of who has subscribed.. if not user then obviously cancel everything.. metadata mai user ka auth id diya hua hai so
        return c.json({ error: 'invalid session' }, 400);
      }

      await db
        .insert(subscriptions)
        // @ts-expect-error idk
        .values({
          status: subscription.status,
          userId: session.metadata.userId,
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          priceId: subscription.items.data[0].price.product,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }

    if (event.type === 'invoice.payment_succeeded') {
      // on extension of subscription changing the data to the database
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        return c.json({ error: 'invalid session' }, 400);
      }

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id));
    }
    // webhooks need to receive a success event after doing anything to avoid webhook getting blocked
    return c.json(null, 200);
  });

export default app;
