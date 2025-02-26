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

  // Endpoint to create a billing portal session
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

  // Endpoint to get the current subscription status
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

    return c.json({
      data: {
        ...subscription,
        active,
      },
    });
  })

  // Endpoint to create a checkout session
  .post('/checkout', verifyAuth(), async (c) => {
    const auth = c.get('authUser');

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
        userId: auth.token.id, // Ensure userId is set in metadata
      },
    });

    console.log('🔹 Created checkout session metadata:', session.metadata);

    const url = session.url;

    if (!url) {
      return c.json({ error: 'failed to create session' }, 400);
    }

    return c.json({ data: url });
  })

  // Webhook endpoint for Stripe events
  .post('/webhook', async (c) => {
    const body = await c.req.text();
    const signature = c.req.header('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.error('❌ Invalid Stripe webhook signature:', error);
      return c.json({ error: 'invalid signature' }, 400);
    }

    console.log('🔔 Stripe webhook event received:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('🔹 Checkout session metadata:', session.metadata);

      if (!session?.metadata?.userId) {
        console.error('❌ User ID is missing in session metadata');
        return c.json({ error: 'Invalid session: userId missing' }, 400);
      }

      // Retrieve the subscription to update its metadata
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      console.log('🔹 Subscription details:', subscription);

      // Update the subscription metadata with the userId
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          userId: session.metadata.userId, // Propagate userId to subscription metadata
        },
      });

      console.log(
        '✅ Subscription metadata updated with userId:',
        session.metadata.userId,
      );

      // Insert the subscription into the database
      await db.insert(subscriptions).values({
        status: subscription.status,
        userId: session.metadata.userId,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Subscription created in database');
    }

    // Handle invoice.payment_succeeded event
    if (event.type === 'invoice.payment_succeeded') {
      console.log('✅ Event received: invoice.payment_succeeded');

      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription;

      console.log('🔹 Invoice details:', invoice);
      console.log('🔹 Subscription ID from invoice:', subscriptionId);

      if (!subscriptionId) {
        console.error('❌ Subscription ID is missing in invoice');
        return c.json({ error: 'Subscription ID not found' }, 400);
      }

      // Retrieve the subscription to get metadata
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId as string,
      );

      console.log('🔹 Subscription metadata:', subscription.metadata);

      if (!subscription.metadata?.userId) {
        console.error('❌ User ID is missing in subscription metadata');
        return c.json({ error: 'Invalid session: userId missing' }, 400);
      }

      const userId = subscription.metadata.userId;

      console.log('🔹 User ID from subscription metadata:', userId);

      // Update the subscription in the database
      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId));

      console.log('✅ Subscription updated in database');
    }

    // Return a success response for the webhook
    return c.json(null, 200);
  });

export default app;
