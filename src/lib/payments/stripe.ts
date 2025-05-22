import Stripe from 'stripe';
import { redirect } from 'next/navigation';

import {
  getUserByStripeCustomerId,
  updateUserSubscription,
  getUserSubscriptionByUserId
} from '@/lib/db/queries';
import { UserSubscription } from '@/constants/user';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
});

export async function createCheckoutSession({
  userId,
  priceId,
}: {
  userId: string;
  priceId: string;
}) {
  const user = await getUserSubscriptionByUserId({ userId });

  if (!user) return redirect(`/login?redirect=checkout&priceId=${priceId}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/pricing`,
    customer: user.stripe_customer_id ?? undefined,
    client_reference_id: user.user_id,
    allow_promotion_codes: true,
    metadata: {
      user_id: userId,
      priceId,
    },
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(user: UserSubscription) {
  if (!user.stripe_customer_id || !user.stripe_product_id) {
    redirect('/dashboard/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(user.stripe_product_id);

    if (!product.active) throw new Error("User's product is not active in Stripe");

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });

    if (prices.data.length === 0) throw new Error("No active prices found for the user's product");


    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other'
            ]
          }
        },
        payment_method_update: {
          enabled: true
        }
      }
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price?.id;
  const user = await getUserByStripeCustomerId({ stripeCustomerId: customerId });

  if (!user) {
    console.error('User not found for Stripe customer:', customerId);

    return;
  }

  if (status === 'active') {
    const plan = subscription.items.data[0]?.plan;

    await updateUserSubscription(user.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      stripePriceId: priceId,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: status
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      stripePriceId: null,
      planName: null,
      subscriptionStatus: status
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}
