/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
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
    console.log('🔹 [Billing] Request received');
    const auth = c.get('authUser');

    console.log('🔹 [Billing] Auth User:', auth);

    if (!auth.token?.id) {
      console.error('❌ [Billing] Unauthorized access - No auth token');
      return c.json({ error: 'unauthorized' }, 401);
    }

    console.log('🔹 [Billing] Checking subscription for user:', auth.token.id);
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    if (!subscription) {
      console.error(
        '❌ [Billing] No subscription found for user:',
        auth.token.id,
      );
      return c.json({ error: 'No subscription found' }, 404);
    }

    console.log('✅ [Billing] Subscription found:', subscription);

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });

    console.log('✅ [Billing] Stripe Billing Portal Session created:', session);

    if (!session.url) {
      console.error('❌ [Billing] Failed to create billing session');
      return c.json({ error: 'failed to create session' }, 400);
    }

    return c.json({ data: session.url });
  })

  .get('/current', verifyAuth(), async (c) => {
    console.log('🔹 [Current Subscription] Request received');
    const auth = c.get('authUser');

    console.log('🔹 [Current Subscription] Auth User:', auth);

    if (!auth.token?.id) {
      console.error(
        '❌ [Current Subscription] Unauthorized access - No auth token',
      );
      return c.json({ error: 'unauthorized' }, 401);
    }

    console.log(
      '🔹 [Current Subscription] Checking subscription for user:',
      auth.token.id,
    );
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    console.log('✅ [Current Subscription] Subscription Data:', subscription);

    const active = checkIsActive(subscription);

    return c.json({
      data: {
        ...subscription,
        active,
      },
    });
  })

  .post('/checkout', verifyAuth(), async (c) => {
    console.log('🔹 [Checkout] Request received');
    const auth = c.get('authUser');

    console.log('🔹 [Checkout] Auth User:', auth);

    if (!auth.token?.id) {
      console.error('❌ [Checkout] Unauthorized access - No auth token');
      return c.json({ error: 'unauthorized' }, 401);
    }

    console.log(
      '🔹 [Checkout] Creating Stripe Checkout Session for user:',
      auth.token.id,
    );

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=1`,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'required',
      customer_email: auth.token.email || '',
      metadata: {
        userId: auth.token.id,
      },
    });

    console.log('✅ [Checkout] Stripe Checkout Session created:', session);

    if (!session.url) {
      console.error('❌ [Checkout] Failed to create session');
      return c.json({ error: 'failed to create session' }, 400);
    }

    return c.json({ data: session.url });
  })

  .post('/webhook', async (c) => {
    console.log('🔹 [Webhook] Received Stripe Event');

    const body = await c.req.text();
    const signature = c.req.header('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
      console.log('✅ [Webhook] Event Verified:', event.type);
    } catch (error) {
      console.error('❌ [Webhook] Invalid Signature:', error);
      return c.json({ error: 'invalid signature' }, 400);
    }

    console.log('🔹 [Webhook] Event Data:', event.data.object);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
      console.log(
        '🔹 [Webhook] Checkout Session Completed - Retrieving Subscription',
      );

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      console.log('✅ [Webhook] Subscription Retrieved:', subscription);

      if (!session?.metadata?.userId) {
        console.error('❌ [Webhook] Invalid Session - No user ID in metadata');
        return c.json({ error: 'invalid session' }, 400);
      }

      console.log(
        '✅ [Webhook] Storing Subscription Data for User:',
        session.metadata.userId,
      );

      await db.insert(subscriptions).values({
        status: subscription.status,
        userId: session.metadata.userId,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        priceId: subscription.items.data[0].price.product,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ [Webhook] Subscription Data Stored in DB');
    }

    if (event.type === 'invoice.payment_succeeded') {
      console.log(
        '🔹 [Webhook] Invoice Payment Succeeded - Updating Subscription',
      );

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      console.log('✅ [Webhook] Subscription Retrieved:', subscription);

      if (!session?.metadata?.userId) {
        console.error('❌ [Webhook] Invalid Session - No user ID in metadata');
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

      console.log('✅ [Webhook] Subscription Updated in DB');
    }

    return c.json(null, 200);
  });

export default app;
