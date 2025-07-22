export enum PlanName {
  FREE = 'free',
  PRO = 'pro',
  UNLIMITED = 'unlimited'
}

type Entitlements = {
  maxMessagesPerDay: number
}

export const entitlementsByPlanName: Record<PlanName, Entitlements> = {
  [PlanName.FREE]: {
    maxMessagesPerDay: 5
  },
  [PlanName.PRO]: {
    maxMessagesPerDay: 100
  },
  [PlanName.UNLIMITED]: {
    maxMessagesPerDay: 1000
  }
}

export type Profile = {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
  created_at: Date
}

export type UserSubscription = {
  id: number
  user_id: string
  stripe_customer_id: string | null
  stripe_product_id: string | null
  stripe_price_id: string | null
  stripe_subscription_id: string | null
  plan_name: string
  status: string
  updated_at: Date
  created_at: Date
}
