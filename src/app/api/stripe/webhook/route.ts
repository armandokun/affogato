// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// import { createClient } from "@/lib/supabase/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-04-30.basil",
// });

// export async function POST(req: NextRequest) {
//   const sig = req.headers.get("stripe-signature");
//   const body = await req.text();

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       sig!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch {
//     return NextResponse.json(
//       { error: "Webhook signature verification failed" },
//       { status: 400 }
//     );
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const userId = session.metadata?.user_id;
//     const priceId = session.metadata?.priceId;
//     const customerId = session.customer as string;
//     const subscriptionId = session.subscription as string;

//     const subscription: Stripe.Subscription =
//       await stripe.subscriptions.retrieve(subscriptionId);

//     const supabase = await createClient();

//     await supabase
//       .from("subscriptions")
//       .update({
//         stripe_customer_id: customerId,
//         stripe_subscription_id: subscriptionId,
//         stripe_price_id: priceId,
//         status: subscription.status,
//         current_period_end: new Date(
//           (subscription?.days_until_due ?? 0) * 24 * 60 * 60 * 1000
//         ).toISOString(),
//         plan_id: priceId,
//       })
//       .eq("user_id", userId);
//   }

//   if (
//     event.type === "customer.subscription.updated" ||
//     event.type === "customer.subscription.deleted"
//   ) {
//     const subscription = event.data.object as Stripe.Subscription;
//     const customerId = subscription.customer as string;
//     const priceId = subscription.items.data[0]?.price.id;
//     const subscriptionId = subscription.id;
//     const status = subscription.status;
//     const currentPeriodEnd = subscription.current_period_end
//       ? new Date(subscription.current_period_end * 1000).toISOString()
//       : null;

//     // Find user by customerId
//     const supabase = await createClient();
//     const { data: sub } = await supabase
//       .from("subscriptions")
//       .select("user_id")
//       .eq("stripe_customer_id", customerId)
//       .single();
//     if (sub?.user_id) {
//       await supabase
//         .from("subscriptions")
//         .update({
//           stripe_price_id: priceId,
//           stripe_subscription_id: subscriptionId,
//           status,
//           current_period_end: currentPeriodEnd,
//           plan_id: priceId,
//         })
//         .eq("user_id", sub.user_id);
//     }
//   }

//   return NextResponse.json({ received: true });
// }
