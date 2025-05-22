'use server';

import { redirect } from 'next/navigation';

import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getUserSubscriptionByUserId } from '../db/queries';

export const checkoutAction = async (formData: FormData, userId: string) => {
  const priceId = formData.get('priceId') as string;

  await createCheckoutSession({ userId, priceId });
}

export const customerPortalAction = async (_, userId: string) => {
  const user = await getUserSubscriptionByUserId({ userId });

  if (!user) throw new Error('User not found');

  const portalSession = await createCustomerPortalSession(user);

  redirect(portalSession.url);
}
