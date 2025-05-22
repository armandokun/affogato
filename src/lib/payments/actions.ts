'use server';

// import { redirect } from 'next/navigation';
import { createCheckoutSession } from './stripe';
// import { Profile } from '@/constants/user';

export const checkoutAction = async (formData: FormData, userId: string) => {
  const priceId = formData.get('priceId') as string;

  await createCheckoutSession({ userId, priceId });
}

// export const customerPortalAction = async (_, user: Profile) => {
//   const portalSession = await createCustomerPortalSession(user);

//   redirect(portalSession.url);
// }
